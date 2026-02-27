Service Name,Primary Responsibility (Kya Kaam Karega),Main Endpoints / Features (Examples),DB Collections (MongoDB),RabbitMQ Events Publish Karega?,Consume Karega?,Notes / Tips
Auth Service,Sab users ka authentication & authorization (single source of truth for login/register/roles),"- POST /register
- POST /login → JWT return
- GET /validate-token
- Forgot password (optional)","users (email, password hash, role, name, etc.)","Rarely (e.g., user.created)",No,"Sabse important. Har service isse depend karegi JWT ke liye. Role: admin, teacher, student"
Student Service,"Student-related data manage karna (profile, enrollment, personal info)","- POST /students (add student profile)
- GET /students/:id
- PUT /students/:id/update
- GET /students/class/:classId","students (userId ref, class, rollNo, parentInfo, address, feesStatus)","student.enrolled, student.updated",user.created (from Auth),Student add karte time pehle Auth call → userId leke yahan profile banao
Teacher Service,Teacher profiles aur unke class/subject management,"- POST /teachers (add teacher)
- GET /teachers/:id
- GET /teachers/class/:classId (assigned classes)","teachers (userId ref, subjects[], assignedClasses[], qualification)",teacher.assigned-class,user.created,Teacher ko class assign karne ka logic yahan
Attendance Service,"Attendance marking, viewing, reports (daily/monthly)","- POST /attendance/mark (bulk/single)
- GET /attendance/student/:studentId/date/:date
- GET /attendance/report/class/:classId/month/:month","attendance (studentId, date, status: P/A/L, markedBy teacherId)",attendance.marked,student.enrolled (init default records),RabbitMQ se notification trigger (parent ko absent alert)
Grade / Exam Service,"Marks entry, exams, report cards, calculations (percentage, grades)","- POST /grades/submit
- GET /grades/student/:studentId
- GET /report-card/:studentId/semester/:sem","grades (studentId, subject, examType, marks, total, grade)",grade.assigned,attendance.marked (low attendance warning),Average/grade calculate karne ka logic yahan
Communication Service,"Real-time chat, notifications, announcements, meetings (Socket.IO + email/push)","- Socket.IO events: message, join-room
- POST /announcements
- POST /notifications/send","messages (chat), notifications (userId, type, message)",No (mostly consumer),"Yes (attendance.marked, grade.assigned, student.enrolled, payment.success)",Yeh sab events consume karega aur Socket.IO se push ya email bhejega
Payment / Fees Service (Optional – agar time ho to add karo),"Fees payment tracking, invoices, Razorpay integration (demo mode)","- POST /fees/pay (Razorpay webhook)
- GET /fees/student/:studentId/status","fees (studentId, amount, dueDate, paidAmount, status)","payment.success, payment.failed",No,"Real payment nahi, demo Razorpay test key use karo"