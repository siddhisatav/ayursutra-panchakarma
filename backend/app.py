from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import threading
import razorpay

# Razorpay Client Configuration
# TODO: Replace with your actual Razorpay Test Keys
RAZORPAY_KEY_ID = "rzp_test_SeEjvw6v5Tk5MP" 
RAZORPAY_KEY_SECRET = "ujopIj8fOjlsG2V7P6rT2160"

razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

app = Flask(__name__)
CORS(app)
db_path = os.path.join(os.path.dirname(__file__), 'ayursutra.db')
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    role = db.Column(db.String(50), nullable=False)
    name = db.Column(db.String(120), nullable=False)
    experience = db.Column(db.String(120), nullable=True)
    specialization = db.Column(db.String(120), nullable=True)
    shiftTiming = db.Column(db.String(120), nullable=True)
    qualification = db.Column(db.String(120), nullable=True)
    bio = db.Column(db.Text, nullable=True)

    def to_dict(self):
        return {
            "id": self.id, 
            "email": self.email, 
            "role": self.role, 
            "name": self.name,
            "experience": self.experience,
            "specialization": self.specialization,
            "shiftTiming": self.shiftTiming,
            "qualification": self.qualification,
            "bio": self.bio
        }

class Appointment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patientId = db.Column(db.Integer, nullable=False)
    patientName = db.Column(db.String(120), nullable=False)
    therapistId = db.Column(db.Integer, nullable=False)
    therapistName = db.Column(db.String(120), nullable=True) # Made nullable as per instructions to stop sending it from frontend
    therapyType = db.Column(db.String(120), nullable=False)
    date = db.Column(db.String(50), nullable=False)
    time = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(50), nullable=False, default='pending')
    notes = db.Column(db.Text, default='')
    diet = db.Column(db.Text, default='')
    paymentStatus = db.Column(db.String(50), nullable=False, default='pending')
    amount = db.Column(db.Integer, nullable=True)
    paymentMethod = db.Column(db.String(50), nullable=False, default='cash')
    razorpay_order_id = db.Column(db.String(120), nullable=True)
    razorpay_payment_id = db.Column(db.String(120), nullable=True)
    payment_date = db.Column(db.String(120), nullable=True)
    
    # New fields for Practitioner System
    assignedTherapy = db.Column(db.String(120), nullable=True)
    duration = db.Column(db.Integer, nullable=True)
    practitionerNotes = db.Column(db.Text, nullable=True)
    currentDay = db.Column(db.Integer, default=1)

    def to_dict(self):
        return {
            "id": self.id, 
            "patientId": int(self.patientId), 
            "patientName": self.patientName,
            "therapistId": int(self.therapistId), 
            "therapistName": self.therapistName,
            "therapyType": self.therapyType, 
            "date": self.date, 
            "time": self.time,
            "status": self.status, 
            "notes": self.notes,
            "diet": self.diet,
            "paymentStatus": self.paymentStatus,
            "amount": self.amount,
            "paymentMethod": self.paymentMethod,
            "razorpay_order_id": self.razorpay_order_id,
            "razorpay_payment_id": self.razorpay_payment_id,
            "payment_date": self.payment_date,
            "assignedTherapy": self.assignedTherapy,
            "duration": self.duration,
            "practitionerNotes": self.practitionerNotes,
            "currentDay": self.currentDay
        }

class HealthProfile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patientId = db.Column(db.Integer, nullable=False, unique=True)
    age = db.Column(db.Integer, nullable=True)
    gender = db.Column(db.String(50), nullable=True)
    bodyType = db.Column(db.String(50), nullable=True)
    symptoms = db.Column(db.Text, nullable=True) # Stored as JSON string or comma separated
    chronicDiseases = db.Column(db.Text, nullable=True)
    allergies = db.Column(db.Text, nullable=True)
    medications = db.Column(db.Text, nullable=True)
    stressLevel = db.Column(db.String(50), nullable=True)
    sleepQuality = db.Column(db.String(50), nullable=True)
    painLevel = db.Column(db.Integer, nullable=True)
    energyLevel = db.Column(db.String(50), nullable=True)

    def to_dict(self):
        return {
            "id": self.id, "patientId": self.patientId, "age": self.age,
            "gender": self.gender, "bodyType": self.bodyType, "symptoms": self.symptoms,
            "chronicDiseases": self.chronicDiseases, "allergies": self.allergies,
            "medications": self.medications, "stressLevel": self.stressLevel,
            "sleepQuality": self.sleepQuality, "painLevel": self.painLevel,
            "energyLevel": self.energyLevel
        }

class SessionNote(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    appointmentId = db.Column(db.Integer, nullable=False)
    dayNumber = db.Column(db.Integer, nullable=False)
    beforeNotes = db.Column(db.Text, nullable=True)
    afterNotes = db.Column(db.Text, nullable=True)
    date = db.Column(db.String(50), nullable=False)

    def to_dict(self):
        return {
            "id": self.id, "appointmentId": self.appointmentId,
            "dayNumber": self.dayNumber, "beforeNotes": self.beforeNotes,
            "afterNotes": self.afterNotes, "date": self.date
        }

class TreatmentSession(db.Model):
    __tablename__ = 'treatment_sessions'
    session_id           = db.Column(db.Integer, primary_key=True)
    appointment_id       = db.Column(db.Integer, nullable=False)
    patient_id           = db.Column(db.Integer, nullable=False)
    therapist_id         = db.Column(db.Integer, nullable=False)
    therapist_name       = db.Column(db.String(120), nullable=True)
    treatment_notes      = db.Column(db.Text, nullable=True)
    dietary_prescription = db.Column(db.Text, nullable=True)
    created_at           = db.Column(db.String(50), nullable=False)

    def to_dict(self):
        return {
            "session_id":           self.session_id,
            "appointment_id":       self.appointment_id,
            "patient_id":           self.patient_id,
            "therapist_id":         self.therapist_id,
            "therapist_name":       self.therapist_name,
            "treatment_notes":      self.treatment_notes,
            "dietary_prescription": self.dietary_prescription,
            "created_at":           self.created_at
        }

class Note(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patientId = db.Column(db.Integer, nullable=False)
    text = db.Column(db.Text, nullable=False)
    date = db.Column(db.String(50), nullable=False)
    authorName = db.Column(db.String(120), nullable=False)

    def to_dict(self):
        return {"id": self.id, "patientId": int(self.patientId), "text": self.text, "date": self.date, "authorName": self.authorName}

class DietPlan(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patientId = db.Column(db.Integer, nullable=False, unique=True)
    planData = db.Column(db.Text, nullable=False) 

    def to_dict(self):
        return {"id": self.id, "patientId": int(self.patientId), "planData": json.loads(self.planData)}

class Bill(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    appointmentId = db.Column(db.Integer, nullable=False)
    patientId = db.Column(db.Integer, nullable=False)
    amount = db.Column(db.Float, nullable=False)
    paymentMethod = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(50), nullable=False)
    date = db.Column(db.String(50), nullable=False)

    def to_dict(self):
        return {
            "id": self.id, "appointmentId": int(self.appointmentId),
            "patientId": int(self.patientId), "amount": self.amount,
            "paymentMethod": self.paymentMethod, "status": self.status,
            "date": self.date
        }

class Setting(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    key = db.Column(db.String(100), unique=True, nullable=False)
    value = db.Column(db.Text, nullable=False)


# Initialize DB and mock data
def ensure_appointment_columns():
    try:
        result = db.session.execute(text("PRAGMA table_info('appointment')")).fetchall()
        existing_columns = [row[1] for row in result]

        if 'paymentMethod' not in existing_columns:
            db.session.execute(text("ALTER TABLE appointment ADD COLUMN paymentMethod VARCHAR(50)"))
        if 'paymentStatus' not in existing_columns:
            db.session.execute(text("ALTER TABLE appointment ADD COLUMN paymentStatus VARCHAR(50) DEFAULT 'pending'"))
        if 'razorpay_order_id' not in existing_columns:
            db.session.execute(text("ALTER TABLE appointment ADD COLUMN razorpay_order_id VARCHAR(120)"))
        if 'razorpay_payment_id' not in existing_columns:
            db.session.execute(text("ALTER TABLE appointment ADD COLUMN razorpay_payment_id VARCHAR(120)"))
        if 'payment_date' not in existing_columns:
            db.session.execute(text("ALTER TABLE appointment ADD COLUMN payment_date VARCHAR(120)"))

        db.session.commit()
        db.session.execute(text("UPDATE appointment SET paymentMethod = 'cash' WHERE paymentMethod IS NULL"))
        db.session.execute(text("UPDATE appointment SET paymentStatus = 'pending' WHERE paymentStatus IS NULL"))
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print("Migration info:", e)

with app.app_context():
    db.create_all()
    ensure_appointment_columns()
    if User.query.count() == 0:
        # Seed users
        db.session.add_all([
            User(email='patient@ayur.com', password='patient123', role='patient', name='Rajesh Kumar'),
            User(email='therapist@ayur.com', password='therapist123', role='therapist', name='Dr. Priya Sharma'),
            User(email='practitioner@ayur.com', password='practitioner123', role='practitioner', name='Dr. Anil Verma')
        ])
        db.session.commit()
        
    if Setting.query.count() == 0:
        db.session.add_all([
            Setting(key='notifications', value=json.dumps({"emailNotifications": True, "smsReminders": True, "dailyReports": False})),
            Setting(key='center', value=json.dumps({"name": "AyurSutra Panchakarma", "email": "contact@ayursutra.com", "phone": "+91 98765 43210", "address": "123 Wellness Street, Ayurveda City, India"})),
            Setting(key='two_factor', value=json.dumps({"enabled": False}))
        ])
        db.session.commit()

# --- Auth Routes ---
@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data.get('email'), password=data.get('password')).first()
    if user:
        return jsonify(user.to_dict())
    return jsonify({"error": "Invalid credentials"}), 401

@app.route('/api/auth/signup', methods=['POST'])
def signup():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')
    role = data.get('role', 'patient')
    
    # Check if user already exists
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already registered"}), 400
        
    new_user = User(email=email, password=password, name=name, role=role)
    db.session.add(new_user)
    db.session.commit()
    return jsonify(new_user.to_dict()), 201

@app.route('/api/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([u.to_dict() for u in users])

@app.route('/api/therapists', methods=['GET'])
def get_therapists():
    try:
        all_users = [u.to_dict() for u in User.query.all()]
        therapists = [u for u in all_users if u.get("role") == "therapist"]
        return jsonify(therapists)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- Therapist Profile Routes ---
@app.route('/api/therapist/profile/', methods=['GET'])
def get_therapist_profile():
    """Get therapist profile details"""
    try:
        # Get the therapist ID from the request (assuming it's passed via query param or header)
        therapist_id = request.args.get('id')
        
        if not therapist_id:
            return jsonify({"error": "Therapist ID is required"}), 400
        
        user = User.query.get(int(therapist_id))
        if not user:
            return jsonify({"error": "Therapist not found"}), 404
        
        if user.role != 'therapist':
            return jsonify({"error": "User is not a therapist"}), 403
        
        return jsonify(user.to_dict()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/therapist/profile/', methods=['PUT'])
def update_therapist_profile():
    """Update therapist profile details"""
    try:
        data = request.json
        therapist_id = data.get('id')
        
        if not therapist_id:
            return jsonify({"error": "Therapist ID is required"}), 400
        
        user = User.query.get(int(therapist_id))
        if not user:
            return jsonify({"error": "Therapist not found"}), 404
        
        if user.role != 'therapist':
            return jsonify({"error": "User is not a therapist"}), 403
        
        # Update allowed fields
        if 'name' in data:
            user.name = data.get('name')
        if 'experience' in data:
            user.experience = data.get('experience')
        if 'specialization' in data:
            user.specialization = data.get('specialization')
        if 'shiftTiming' in data:
            user.shiftTiming = data.get('shiftTiming')
        if 'qualification' in data:
            user.qualification = data.get('qualification')
        if 'bio' in data:
            user.bio = data.get('bio')
        
        db.session.commit()
        return jsonify(user.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# --- Email Utility ---
def send_booking_request_email(to_email, patient_name, therapist_name, date, time, therapy):
    sender_email = "eeshantest@gmail.com"  
    sender_password = "tzbqfwxncdckrnan" 

    msg = MIMEMultipart()
    msg['From'] = f"AyurSutra App <{sender_email}>"
    msg['To'] = to_email
    msg['Subject'] = "Appointment Request Received - AyurSutra"

    body = f"""
Dear {patient_name},

Your appointment request for {therapy} has been received!

Details:
- Therapist: {therapist_name}
- Date: {date}
- Time: {time}
- Status: Awaiting Confirmation

We will notify you once the practitioner confirms the appointment and assigns the payment details.

Thank you for choosing AyurSutra Panchakarma!
    """
    msg.attach(MIMEText(body, 'plain'))

    try:
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(sender_email, sender_password)
        server.send_message(msg)
        server.quit()
        print(f"Successfully sent request email to {to_email}")
    except Exception as e:
        print(f"Failed to send email to {to_email}: {e}")


def send_payment_done_email(to_email, patient_name, therapy, amount, payment_method):
    sender_email = "eeshantest@gmail.com"  
    sender_password = "tzbqfwxncdckrnan" 

    msg = MIMEMultipart()
    msg['From'] = f"AyurSutra App <{sender_email}>"
    msg['To'] = to_email
    msg['Subject'] = "Payment Successful & Thank You - AyurSutra"

    body = f"""
Dear {patient_name},

Thank you for visiting AyurSutra Panchakarma!

Your therapy session for {therapy} is completed.
We have successfully received your payment.

BILL DETAILS:
- Amount Paid: ₹{amount}
- Payment Mode: {payment_method.capitalize()}
- Status: PAID

A PDF copy of your bill will be available in your dashboard later.

We hope you had a relaxing and healing experience. Visit again!

Warm regards,
AyurSutra Team
    """
    msg.attach(MIMEText(body, 'plain'))

    try:
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(sender_email, sender_password)
        server.send_message(msg)
        server.quit()
        print(f"Successfully sent payment email to {to_email}")
    except Exception as e:
        print(f"Failed to send email to {to_email}: {e}")

# --- Appointments Routes ---
@app.route('/api/appointments', methods=['GET'])
def get_appointments():
    appointments = Appointment.query.all()
    return jsonify([a.to_dict() for a in appointments])

@app.route('/api/appointments', methods=['POST'])
def create_appointment():
    data = request.json
    
    # Fetch therapist name from User table if not provided
    therapist_name = data.get('therapistName')
    if not therapist_name:
        therapist = db.session.get(User, int(data['therapistId']))
        if therapist:
            therapist_name = therapist.name

    payment_method = data.get('paymentMethod', 'cash') or 'cash'
    payment_status = data.get('paymentStatus', 'pending')
    if payment_method == 'online' and payment_status not in ('paid', 'pending'):
        payment_status = 'pending'

    new_apt = Appointment(
    patientId=int(data['patientId']),
    patientName=data['patientName'],
    therapistId=int(data['therapistId']),
    therapistName=therapist_name,
    therapyType=data['therapyType'],
    date=data['date'],
    time=data['time'],

    status=data.get('status', 'pending'),
    notes=data.get('notes', ''),

    paymentStatus=payment_status,
    paymentMethod=payment_method,
    amount=data.get('amount'),
    razorpay_payment_id=data.get('razorpay_payment_id')
)
    db.session.add(new_apt)
    db.session.commit()

    # Look up the user's email to send the confirmation using the patientId
    user = db.session.get(User, int(data['patientId']))
    
    if user and user.email:
        # Run email sending in background thread so it doesn't freeze the frontend
        threading.Thread(
            target=send_booking_request_email, 
            args=(user.email, new_apt.patientName, new_apt.therapistName, new_apt.date, new_apt.time, new_apt.therapyType)
        ).start()

    return jsonify({"appointment": new_apt.to_dict()}), 201

@app.route('/api/appointments/<int:apt_id>', methods=['PUT'])
def update_appointment(apt_id):
    data = request.json
    apt = Appointment.query.get_or_404(apt_id)

    # If practitioner is confirming and passing payment data, generate the Bill now!
    if apt.paymentStatus == 'paid':
        return jsonify({
            "message": "Payment already completed"
        }), 400
        apt.status = 'confirmed'
        bill = Bill.query.filter_by(appointmentId=apt_id).first()
        if not bill:
            new_bill = Bill(
                appointmentId=apt.id,
                patientId=apt.patientId,
                amount=float(data.get('amount', 500.0)),
                paymentMethod=data.get('paymentMethod', 'cash'),
                status='pending',
                date=apt.date
            )
            db.session.add(new_bill)
    
    elif data.get('status') == 'completed':
        apt.status = 'completed'
        bill = Bill.query.filter_by(appointmentId=apt_id).first()
        if bill and bill.status == 'pending':
            if bill.paymentMethod == 'cash':
                bill.status = 'paid'
                apt.paymentStatus = 'paid'
                # Send the "Payment Done" email for Cash payments!
                user = User.query.get(apt.patientId)
                if user and user.email:
                    threading.Thread(
                        target=send_payment_done_email, 
                        args=(user.email, apt.patientName, apt.therapyType, bill.amount, bill.paymentMethod)
                    ).start()
            # If online, it stays pending until Patient pays via Razorpay

    if 'status' in data and not ('paymentMethod' in data or data.get('status') == 'completed'):
         apt.status = data['status']
         
    if 'paymentStatus' in data:
        apt.paymentStatus = data['paymentStatus']
    if 'paymentMethod' in data:
        apt.paymentMethod = data['paymentMethod']
    if 'razorpay_payment_id' in data:
        apt.razorpay_payment_id = data['razorpay_payment_id']
    if 'razorpay_order_id' in data:
        apt.razorpay_order_id = data['razorpay_order_id']
    if 'payment_date' in data:
        apt.payment_date = data['payment_date']
    if 'notes' in data:
        apt.notes = data['notes']
    if 'date' in data:
        apt.date = data['date']
    if 'time' in data:
        apt.time = data['time']
        
    db.session.commit()
    return jsonify(apt.to_dict())

@app.route('/api/appointments/<int:apt_id>/payment', methods=['PUT'])
def update_appointment_payment(apt_id):
    data = request.json
    apt = Appointment.query.get_or_404(apt_id)

    if 'paymentMethod' in data:
        apt.paymentMethod = data['paymentMethod']
    if 'paymentStatus' in data:
        apt.paymentStatus = data['paymentStatus']
    if 'razorpay_payment_id' in data:
        apt.razorpay_payment_id = data['razorpay_payment_id']
    if 'razorpay_order_id' in data:
        apt.razorpay_order_id = data['razorpay_order_id']
    if 'payment_date' in data:
        apt.payment_date = data['payment_date']

    db.session.commit()
    return jsonify(apt.to_dict()), 200

@app.route('/api/update-appointment', methods=['PUT', 'OPTIONS'])
def update_appointment_details():
    if request.method == 'OPTIONS':
        return jsonify({}), 200

    try:
        data = request.get_json()
        appointment_id = data.get('appointmentId')
        
        if not appointment_id:
            return jsonify({"error": "appointmentId is required"}), 400

        appointment = db.session.get(Appointment, int(appointment_id))
        if not appointment:
            return jsonify({"error": "Appointment not found"}), 404

        if 'notes' in data:
            appointment.notes = data['notes']
        if 'diet' in data:
            appointment.diet = data['diet']
        if 'status' in data:
            appointment.status = data['status']
            if data['status'] == 'confirmed':
                appointment.paymentStatus = 'pending'
                # ✅ BACKEND VALIDATION: therapistId required to confirm
                therapist_id = data.get('therapistId') or appointment.therapistId
                if not therapist_id:
                    return jsonify({"error": "A therapistId is required to confirm an appointment."}), 400
        
        if 'paymentStatus' in data:
            appointment.paymentStatus = data['paymentStatus']
        
        if 'amount' in data:
            appointment.amount = int(data['amount'])
        
        if 'paymentMethod' in data:
            appointment.paymentMethod = data['paymentMethod']

        if 'assignedTherapy' in data:
            appointment.assignedTherapy = data['assignedTherapy']
        if 'duration' in data:
            appointment.duration = int(data['duration'])
        if 'practitionerNotes' in data:
            appointment.practitionerNotes = data['practitionerNotes']
        if 'currentDay' in data:
            appointment.currentDay = int(data['currentDay'])
        if 'therapistId' in data and data['therapistId']:
              appointment.therapistId = int(data['therapistId'])
              # ✅ ALSO UPDATE therapistName
              therapist = db.session.get(User, int(data['therapistId']))
              if therapist:
                 appointment.therapistName = therapist.name

        db.session.commit()
        return jsonify(appointment.to_dict()), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/api/appointments/<int:apt_id>', methods=['DELETE'])
def delete_appointment(apt_id):
    apt = Appointment.query.get_or_404(apt_id)
    db.session.delete(apt)
    db.session.commit()
    return jsonify({"message": "Deleted"}), 200

# --- Treatment Session (Clinical Timeline) Routes ---
@app.route('/api/treatment-history/<int:appointment_id>', methods=['GET'])
def get_treatment_history(appointment_id):
    """Return all treatment sessions for an appointment, newest first."""
    try:
        sessions = TreatmentSession.query.filter_by(
            appointment_id=appointment_id
        ).order_by(TreatmentSession.session_id.desc()).all()
        return jsonify([s.to_dict() for s in sessions]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/add-treatment-session', methods=['POST', 'OPTIONS'])
def add_treatment_session():

    if request.method == 'OPTIONS':
        return jsonify({}), 200

    try:
        import datetime

        data = request.get_json()

        appointment_id = data.get('appointment_id')
        patient_id = data.get('patient_id')
        therapist_id = data.get('therapist_id')

        if not all([appointment_id, patient_id, therapist_id]):
            return jsonify({
                "error": "appointment_id, patient_id, and therapist_id are required"
            }), 400

        current_date = datetime.datetime.now().strftime("%Y-%m-%d")

        # ✅ ALWAYS CREATE NEW SESSION - do NOT update existing ones
        # Each update is a separate history entry (Session 1, Session 2, Session 3, etc.)
        # This preserves complete treatment history instead of overwriting old data
        
        # Validate that at least one field is provided
        if not data.get('treatment_notes') and not data.get('dietary_prescription'):
            return jsonify({"error": "Either treatment_notes or dietary_prescription is required"}), 400
        
        therapist = db.session.get(User, int(therapist_id))

        session = TreatmentSession(
            appointment_id=int(appointment_id),
            patient_id=int(patient_id),
            therapist_id=int(therapist_id),
            therapist_name=therapist.name if therapist else "",
            treatment_notes=data.get('treatment_notes', ''),
            dietary_prescription=data.get(
                'dietary_prescription', ''
            ),
            created_at=datetime.datetime.now().strftime(
                "%Y-%m-%d %H:%M:%S"
            )
        )

        db.session.add(session)
        db.session.commit()

        return jsonify(session.to_dict()), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
# --- Health Profile Routes ---
@app.route('/api/health_profile/<int:patient_id>', methods=['GET'])
def get_health_profile(patient_id):
    profile = HealthProfile.query.filter_by(patientId=patient_id).first()
    if profile:
        return jsonify(profile.to_dict()), 200
    return jsonify({"error": "Profile not found"}), 404

@app.route('/api/health_profile', methods=['POST'])
def save_health_profile():
    data = request.json
    patient_id = data.get('patientId')
    
    if not patient_id:
         return jsonify({"error": "Patient ID required"}), 400

    profile = HealthProfile.query.filter_by(patientId=patient_id).first()
    if not profile:
        profile = HealthProfile(patientId=patient_id)
        db.session.add(profile)

    if 'age' in data: profile.age = data['age']
    if 'gender' in data: profile.gender = data['gender']
    if 'bodyType' in data: profile.bodyType = data['bodyType']
    if 'symptoms' in data: profile.symptoms = data['symptoms']
    if 'chronicDiseases' in data: profile.chronicDiseases = data['chronicDiseases']
    if 'allergies' in data: profile.allergies = data['allergies']
    if 'medications' in data: profile.medications = data['medications']
    if 'stressLevel' in data: profile.stressLevel = data['stressLevel']
    if 'sleepQuality' in data: profile.sleepQuality = data['sleepQuality']
    if 'painLevel' in data: profile.painLevel = data['painLevel']
    if 'energyLevel' in data: profile.energyLevel = data['energyLevel']

    db.session.commit()
    return jsonify(profile.to_dict()), 200

# --- Session Note Routes ---
@app.route('/api/session_notes/<int:appointment_id>', methods=['GET'])
def get_session_notes(appointment_id):
    notes = SessionNote.query.filter_by(appointmentId=appointment_id).all()
    return jsonify([n.to_dict() for n in notes]), 200

@app.route('/api/session_notes', methods=['GET'])
def get_session_notes_by_patient():
    """Returns session notes filtered by patientId (via appointmentId join)."""
    patient_id = request.args.get('patientId')
    try:
        if patient_id:
            apt_ids = [a.id for a in Appointment.query.filter_by(patientId=int(patient_id)).all()]
            if not apt_ids:
                return jsonify([]), 200
            notes = SessionNote.query.filter(SessionNote.appointmentId.in_(apt_ids)).order_by(SessionNote.appointmentId, SessionNote.dayNumber).all()
        else:
            notes = SessionNote.query.all()
        return jsonify([n.to_dict() for n in notes]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/session_notes', methods=['POST'])
def save_session_note():
    data = request.json
    appointment_id = data.get('appointmentId')
    day_number = data.get('dayNumber')

    if not appointment_id or not day_number:
        return jsonify({"error": "appointmentId and dayNumber required"}), 400

    note = SessionNote.query.filter_by(appointmentId=appointment_id, dayNumber=day_number).first()
    if not note:
        import datetime
        note = SessionNote(
            appointmentId=appointment_id, 
            dayNumber=day_number,
            date=datetime.datetime.now().strftime("%Y-%m-%d")
        )
        db.session.add(note)

    if 'beforeNotes' in data:
        note.beforeNotes = data['beforeNotes']
    if 'afterNotes' in data:
        note.afterNotes = data['afterNotes']

    db.session.commit()
    return jsonify(note.to_dict()), 200


# --- Notes Routes ---
@app.route('/api/notes', methods=['GET'])
def get_all_notes():
    notes = Note.query.all()
    return jsonify([n.to_dict() for n in notes])

@app.route('/api/notes/<int:patient_id>', methods=['GET'])
def get_notes_for_patient(patient_id):
    notes = Note.query.filter_by(patientId=patient_id).all()
    return jsonify([n.to_dict() for n in notes])

@app.route('/api/notes', methods=['POST'])
def add_note():
    data = request.json
    new_note = Note(
        patientId=data['patientId'],
        # text=data['text'],
        text = data.get('text'),
       
        date=data['date'],
        authorName=data['authorName']
    )
    db.session.add(new_note)
    db.session.commit()
    return jsonify(new_note.to_dict()), 201

# --- Diet Plan Routes ---
@app.route('/api/diet_plans', methods=['GET'])
def get_all_diet_plans():
    plans = DietPlan.query.all()
    return jsonify([p.to_dict() for p in plans])

@app.route('/api/diet_plans/<int:patient_id>', methods=['GET'])
def get_diet_plan(patient_id):
    plan = DietPlan.query.filter_by(patientId=patient_id).first()
    if plan:
        return jsonify(plan.to_dict())
    return jsonify({"error": "Not found"}), 404

@app.route('/api/diet_plans', methods=['POST'])
def save_diet_plan():
    data = request.json
    patient_id = data['patientId']
    plan_data = json.dumps(data['planData'])
    
    plan = DietPlan.query.filter_by(patientId=patient_id).first()
    if plan:
        plan.planData = plan_data
    else:
        plan = DietPlan(patientId=patient_id, planData=plan_data)
        db.session.add(plan)
    
    db.session.commit()
    return jsonify(plan.to_dict()), 201

# ==========================================
# AI Assistant Route
# ==========================================
@app.route('/api/ai-assistant', methods=['POST', 'OPTIONS'])
def ai_assistant():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
        
    try:
        data = request.get_json()
        if not data or 'message' not in data:
            return jsonify({"error": "Message is required"}), 400

        message = data.get("message", "").lower()

        therapy = "General Therapy"
        diet = "Healthy diet"
        lifestyle = "Daily yoga"
        reply = "Based on your symptoms, here is your recommendation"

        if "stress" in message or "anxiety" in message:
            therapy = "Shirodhara"
            diet = "Herbal tea, almonds"
            lifestyle = "Meditation, 8 hours sleep"
            reply = "I understand you're feeling stressed. Shirodhara is excellent for calming the nervous system."
        elif "digestion" in message or "acidity" in message:
            therapy = "Virechana"
            diet = "Light khichdi, avoid spicy food"
            lifestyle = "Avoid junk food, regular meals"
            reply = "For digestive issues, Virechana helps detoxify the system."
        elif "headache" in message or "migraine" in message:
            therapy = "Nasya"
            diet = "Warm fluids, hydrating foods"
            lifestyle = "Proper sleep, dark room rest"
            reply = "Nasya therapy can help relieve head pressure and tension."

        return jsonify({
            "success": True,
            "data": {
                "reply": reply,
                "therapy": therapy,
                "diet": diet,
                "lifestyle": lifestyle
            }
        }), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

# --- Payment Routes ---
@app.route('/api/create-razorpay-order', methods=['POST'])
def create_razorpay_order():
    try:
        data = request.get_json()
        amount = data.get('amount')
        
        if not amount:
            return jsonify({"error": "Amount is required"}), 400

        order_data = {
            "amount": int(amount) * 100, # convert to paisa
            "currency": "INR",
            "payment_capture": "1"
        }
        
        order = razorpay_client.order.create(data=order_data)
        
        return jsonify({
            "order_id": order["id"],
            "amount": order["amount"],
            "currency": order["currency"],
            "key": RAZORPAY_KEY_ID
        }), 200
        
    except Exception as e:
        print("Razorpay Error:", str(e))
        return jsonify({"error": str(e)}), 500

@app.route('/api/patient-bills/<int:patient_id>', methods=['GET'])
def get_patient_bills(patient_id):
    try:
        appointments = Appointment.query.filter(
            Appointment.patientId == patient_id,
            Appointment.amount.isnot(None)
        ).all()
        
        bills = []
        for apt in appointments:
            bills.append({
                "id": apt.id,
                "amount": apt.amount,
                "date": apt.date,
                "paymentMethod": apt.paymentMethod,
                "paymentStatus": apt.paymentStatus,
                "therapyType": apt.therapyType
            })
        return jsonify(bills), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/verify-payment', methods=['POST'])
def verify_razorpay_payment():
    try:
        data = request.get_json()
        
        order_id = data.get('razorpay_order_id')
        payment_id = data.get('razorpay_payment_id')
        signature = data.get('razorpay_signature')
        appointment_id = data.get('billId') # Using billId from frontend as appointmentId

        # Verify signature
        params_dict = {
            'razorpay_order_id': order_id,
            'razorpay_payment_id': payment_id,
            'razorpay_signature': signature
        }
        
        try:
            razorpay_client.utility.verify_payment_signature(params_dict)
        except Exception:
            return jsonify({"success": False, "message": "Invalid payment signature"}), 400

        # Update Database
        import datetime
        apt = db.session.get(Appointment, int(appointment_id))
        
        if not apt:
            return jsonify({"error": "Appointment not found"}), 404

        apt.paymentStatus = "paid"
        apt.razorpay_payment_id = payment_id
        apt.razorpay_order_id = order_id
        apt.payment_date = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        db.session.commit()
        
        # Send Email
        user = db.session.get(User, int(apt.patientId))
        if user and user.email:
            threading.Thread(
                target=send_payment_done_email, 
                args=(user.email, apt.patientName, apt.therapyType, apt.amount, apt.paymentMethod)
            ).start()

        return jsonify({"success": True, "message": "Payment verified and updated."}), 200
        
    except Exception as e:
        print("Verification Error:", str(e))
        return jsonify({"success": False, "message": str(e)}), 500

# --- Bill Routes ---
@app.route('/api/bills/<int:patient_id>', methods=['GET'])
def get_bills_for_patient(patient_id):
    bills = Bill.query.filter(Bill.patientId == patient_id).all()
    return jsonify([b.to_dict() for b in bills])

# --- Settings Routes ---
settings_data = {
    "emailNotifications": True,
    "smsReminders": True,
    "dailySummary": False
}

@app.route("/api/settings/notifications", methods=["GET"])
def get_settings():
    return jsonify(settings_data)

@app.route("/api/settings/notifications", methods=["PUT", "OPTIONS"])
def update_settings():
    if request.method == "OPTIONS":
        return jsonify({}), 200
        
    global settings_data
    settings_data = request.json
    return jsonify({"message": "Settings updated successfully"})

@app.route('/api/settings/center', methods=['GET', 'PUT', 'OPTIONS'])
def handle_center_settings():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
        
    setting = Setting.query.filter_by(key='center').first()
    if request.method == 'GET':
        if setting:
            return jsonify(json.loads(setting.value))
        return jsonify({"name": "", "email": "", "phone": "", "address": ""})
    
    if request.method == 'PUT':
        data = request.json
        if setting:
            setting.value = json.dumps(data)
        else:
            setting = Setting(key='center', value=json.dumps(data))
            db.session.add(setting)
        db.session.commit()
        return jsonify({"success": True})

@app.route('/api/settings/change-password', methods=['POST', 'OPTIONS'])
def change_password():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    
    data = request.json
    current_pw = data.get('currentPassword')
    new_pw = data.get('newPassword')
    
    user = User.query.filter_by(role='practitioner').first()
    if user and user.password == current_pw:
        user.password = new_pw
        db.session.commit()
        return jsonify({"success": True})
    return jsonify({"error": "Invalid current password"}), 400

@app.route('/api/settings/toggle-2fa', methods=['POST', 'OPTIONS'])
def toggle_2fa():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
        
    setting = Setting.query.filter_by(key='two_factor').first()
    if setting:
        current = json.loads(setting.value)
        current['enabled'] = not current.get('enabled', False)
        setting.value = json.dumps(current)
    else:
        setting = Setting(key='two_factor', value=json.dumps({"enabled": True}))
        db.session.add(setting)
    db.session.commit()
    return jsonify({"success": True})

# --- System & Data Management Routes ---
import csv
from io import StringIO
from flask import Response

@app.route('/api/patients/export', methods=['GET'])
def export_patients():
    users = User.query.filter_by(role='patient').all()
    
    si = StringIO()
    writer = csv.writer(si)
    writer.writerow(['ID', 'Name', 'Email', 'Role'])
    for user in users:
        writer.writerow([user.id, user.name, user.email, user.role])
        
    return Response(si.getvalue(), mimetype='text/csv', headers={"Content-Disposition": "attachment;filename=patients_data.csv"})

@app.route('/api/system/backup', methods=['POST', 'OPTIONS'])
def system_backup():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    return jsonify({"success": True, "message": "Database backup created successfully."})

@app.route('/api/system/clear', methods=['DELETE', 'OPTIONS'])
def system_clear():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
        
    try:
        Appointment.query.delete()
        Note.query.delete()
        DietPlan.query.delete()
        Bill.query.delete()
        Setting.query.delete()
        db.session.commit()
        
        db.session.add_all([
            Setting(key='notifications', value=json.dumps({"emailNotifications": False, "smsReminders": False, "dailyReports": False})),
            Setting(key='center', value=json.dumps({"name": "", "email": "", "phone": "", "address": ""})),
            Setting(key='two_factor', value=json.dumps({"enabled": False}))
        ])
        db.session.commit()
        
        return jsonify({"success": True})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/api/payment/create-order', methods=['POST', 'OPTIONS'])
def create_order():
    if request.method == 'OPTIONS':
        return jsonify({}), 200

    try:
        data = request.get_json()
        amount = data.get("amount", 500)

        # Create real Razorpay order
        order = razorpay_client.order.create({
            "amount": int(amount) * 100,  # paisa
            "currency": "INR",
            "payment_capture": 1
        })

        return jsonify({
            "success": True,
            "order_id": order["id"],
            "amount": order["amount"],
            "currency": order["currency"],
            "key": RAZORPAY_KEY_ID
        })

    except Exception as e:
        print("Razorpay Order Error:", str(e))
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route('/api/reports/daily', methods=['GET', 'OPTIONS'])
def daily_report():
    if request.method == 'OPTIONS':
        return jsonify({}), 200

    import datetime
    today = datetime.datetime.now().strftime("%Y-%m-%d")
    
    appointments = Appointment.query.filter_by(date=today).all()
    total = len(appointments)
    completed = len([a for a in appointments if a.status in ('completed', 'paid')])
    pending = total - completed
    
    bills = Bill.query.filter_by(date=today, status='paid').all()
    revenue = sum([b.amount for b in bills])
    
    return jsonify({
        "total": total,
        "completed": completed,
        "pending": pending,
        "revenue": revenue
    }), 200

import os

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 5000)),
        debug=False
    )

