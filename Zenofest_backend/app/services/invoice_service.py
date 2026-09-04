import os
from fpdf import FPDF


class InvoicePDF(FPDF):
    def header(self):
        self.set_font("Helvetica", "B", 20)
        self.set_text_color(139, 92, 246)
        self.cell(0, 12, "ZENOFEST 2K26", new_x="LMARGIN", new_y="NEXT", align="C")
        self.set_font("Helvetica", "", 10)
        self.set_text_color(100, 100, 100)
        self.cell(0, 6, "PSR Engineering College, Sivakasi", new_x="LMARGIN", new_y="NEXT", align="C")
        self.cell(0, 6, "Department of Information Technology", new_x="LMARGIN", new_y="NEXT", align="C")
        self.ln(4)
        self.set_fill_color(139, 92, 246)
        self.set_text_color(255, 255, 255)
        self.set_font("Helvetica", "B", 10)
        self.cell(0, 10, "  PAYMENT RECEIPT", new_x="LMARGIN", new_y="NEXT", fill=True, align="L")
        self.ln(6)

    def footer(self):
        self.set_y(-20)
        self.set_draw_color(200, 200, 200)
        self.line(20, self.get_y(), 190, self.get_y())
        self.ln(3)
        self.set_font("Helvetica", "I", 8)
        self.set_text_color(150, 150, 150)
        self.cell(0, 5, "This is a computer-generated receipt. No signature required.", new_x="LMARGIN", new_y="NEXT", align="C")
        self.cell(0, 5, "ZenoFest 2K26 | PSR Engineering College, Sivakasi", align="C")


class InvoiceService:
    @staticmethod
    def generate_invoice_pdf(registration, payment):
        pdf = InvoicePDF()
        pdf.add_page()
        pdf.set_auto_page_break(auto=True, margin=25)

        rows = [
            ("Registration ID", registration.registration_id),
            ("Team Name", registration.team_name),
            ("Event", registration.event_name),
            ("Team Leader", registration.leader_name),
            ("Email", registration.leader_email),
            ("Phone", registration.leader_phone or "N/A"),
            ("College", registration.college_name or "N/A"),
            ("Department", registration.department or "N/A"),
            ("Participants", str(registration.total_participants)),
            ("Razorpay Payment ID", payment.razorpay_payment_id or "N/A"),
            ("Payment Date", payment.paid_at.strftime("%d %B %Y, %I:%M %p") if payment.paid_at else "N/A"),
        ]

        pdf.set_font("Helvetica", "", 11)
        for label, value in rows:
            pdf.set_text_color(80, 80, 80)
            pdf.set_font("Helvetica", "B", 10)
            pdf.cell(65, 9, label, border="B")
            pdf.set_font("Helvetica", "", 10)
            pdf.set_text_color(30, 30, 30)
            pdf.cell(0, 9, value, border="B", new_x="LMARGIN", new_y="NEXT")

        pdf.ln(6)
        pdf.set_fill_color(245, 243, 255)
        pdf.set_font("Helvetica", "B", 14)
        pdf.set_text_color(139, 92, 246)
        pdf.cell(0, 12, f"Total Paid:  Rs.{registration.total_amount}", new_x="LMARGIN", new_y="NEXT", align="C", fill=True)

        os.makedirs("invoices", exist_ok=True)
        pdf_path = f"invoices/{registration.registration_id}.pdf"
        pdf.output(pdf_path)
        return pdf_path
