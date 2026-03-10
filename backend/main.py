from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import sqlite3

app = FastAPI(title="中医门诊管理系统")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def init_db():
    conn = sqlite3.connect('clinic.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS patients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        gender TEXT,
        age INTEGER,
        phone TEXT,
        address TEXT,
        history TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )''')
    c.execute('''CREATE TABLE IF NOT EXISTS records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patient_id INTEGER,
        visit_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        chief_complaint TEXT,
        syndrome TEXT,
        treatment TEXT,
        prescription TEXT,
        total_fee REAL,
        FOREIGN KEY (patient_id) REFERENCES patients(id)
    )''')
    conn.commit()
    conn.close()

init_db()

class Patient(BaseModel):
    id: Optional[int] = None
    name: str
    gender: Optional[str] = None
    age: Optional[int] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    history: Optional[str] = None

class Record(BaseModel):
    id: Optional[int] = None
    patient_id: int
    chief_complaint: str
    syndrome: str
    treatment: str
    prescription: str
    total_fee: float = 0.0

@app.get("/")
def read_root():
    return {"message": "中医门诊管理系统 API"}

@app.post("/patients")
def create_patient(patient: Patient):
    conn = sqlite3.connect('clinic.db')
    c = conn.cursor()
    c.execute('INSERT INTO patients (name, gender, age, phone, address, history) VALUES (?, ?, ?, ?, ?, ?)',
              (patient.name, patient.gender, patient.age, patient.phone, patient.address, patient.history))
    conn.commit()
    patient_id = c.lastrowid
    conn.close()
    return {"id": patient_id, "message": "患者创建成功"}

@app.get("/patients")
def get_patients(search: Optional[str] = None):
    conn = sqlite3.connect('clinic.db')
    c = conn.cursor()
    if search:
        c.execute('SELECT * FROM patients WHERE name LIKE ? OR phone LIKE ? ORDER BY created_at DESC',
                  (f'%{search}%', f'%{search}%'))
    else:
        c.execute('SELECT * FROM patients ORDER BY created_at DESC')
    patients = c.fetchall()
    conn.close()
    return [{"id": p[0], "name": p[1], "gender": p[2], "age": p[3], "phone": p[4], "address": p[5], "history": p[6]} for p in patients]

@app.post("/records")
def create_record(record: Record):
    conn = sqlite3.connect('clinic.db')
    c = conn.cursor()
    c.execute('INSERT INTO records (patient_id, chief_complaint, syndrome, treatment, prescription, total_fee) VALUES (?, ?, ?, ?, ?, ?)',
              (record.patient_id, record.chief_complaint, record.syndrome, record.treatment, record.prescription, record.total_fee))
    conn.commit()
    record_id = c.lastrowid
    conn.close()
    return {"id": record_id, "message": "病历创建成功"}

@app.get("/records")
def get_records():
    conn = sqlite3.connect('clinic.db')
    c = conn.cursor()
    c.execute('SELECT r.*, p.name FROM records r JOIN patients p ON r.patient_id = p.id ORDER BY r.visit_date DESC')
    records = c.fetchall()
    conn.close()
    return [{"id": r[0], "patient_id": r[1], "visit_date": r[2], "chief_complaint": r[3],
             "syndrome": r[6], "treatment": r[7], "prescription": r[8], "total_fee": r[9], "patient_name": r[10]} for r in records]

@app.get("/prescriptions/classic")
def get_classic_prescriptions():
    return [
        {"name": "桂枝汤", "composition": "桂枝9g, 白芍9g, 生姜9g, 大枣3枚, 甘草6g", "function": "解肌发表, 调和营卫", "indication": "外感风寒表虚证", "source": "伤寒论"},
       {"name": "麻黄汤", "composition": "麻黄9g, 桂枝6g, 杏仁9g, 甘草3g", "function": "发汗解表, 宣肺平喘", "indication": "外感风寒表实证", "source": "伤寒论"},
        {"name": "小柴胡汤", "composition": "柴胡24g, 黄芩9g, 人参9g, 半夏9g, 甘草9g, 生姜9g, 大枣4枚", "function": "和解少阳", "indication": "伤寒少阳证", "source": "伤寒论"},
        {"name": "四物汤", "composition": "当归10g, 川芎8g, 白芍12g, 熟地黄12g", "function": "补血和血", "indication": "营血虚滞证", "source": "太平惠民和剂局方"},
        {"name": "四君子汤", "composition": "人参10g, 白术9g, 茯苓9g, 甘草6g", "function": "益气健脾", "indication": "脾胃气虚证", "source": "太平惠民和剂局方"},
        {"name": "六味地黄丸", "composition": "熟地黄24g, 山茱萸12g, 山药12g, 泽泻9g, 茯苓9g, 丹皮9g", "function": "滋阴补肾", "indication": "肾阴虚证", "source": "小儿药证直诀"},
        {"name": "逍遥散", "composition": "柴胡9g, 当归9g, 白芍9g, 白术9g, 茯苓9g, 甘草6g, 生姜3片, 薄荷3g", "function": "疏肝解郁, 健脾和营", "indication": "肝郁血虚脾弱证", "source": "太平惠民和剂局方"},
        {"name": "补中益气汤", "composition": "黄芪15g, 人参10g, 白术10g, 炙甘草5g, 当归10g, 陈皮6g, 升麻3g, 柴胡3g", "function": "补中益气, 升阳举陷", "indication": "脾胃气虚, 气虚下陷证", "source": "脾胃论"}
    ]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
