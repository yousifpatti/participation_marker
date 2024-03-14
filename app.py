from flask import Flask, render_template, request, jsonify, send_file
import pandas as pd
import time
import io

app = Flask(__name__)

# Load students data from the spreadsheet and convert all columns to strings
students_data = pd.read_excel('students.xlsx', dtype=str)

attendance_data = []
first_names = []
last_names = []
timeOfAttendance = []

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/mark-attendance', methods=['POST'])
def mark_attendance():
    student_id = request.json['studentId'].replace('DF:', '')

    # Check if student ID exists
    if student_id in students_data['ID'].values:
        # Get student's first name and last name
        student = students_data[students_data['ID'] == student_id].iloc[0]
        first_name = student['First Name']
        last_name = student['Last Name']

        attendance_data.append(student_id)
        first_names.append(first_name)
        last_names.append(last_name)
        timeOfAttendance.append(time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()))
        
        # Here you can log the attendance time
        
        return jsonify({'message': f'Attendance marked for {first_name} {last_name}.'}), 200
    else:
        return jsonify({'message': 'Student not found.'}), 404

@app.route('/dump-sheet', methods=['POST'])
def dump_sheet():
    sheet_name = request.json['sheetName']
    if not sheet_name or sheet_name == '':
        return jsonify({'message': 'Sheet name not provided.'}), 400
    
    # Create a new DataFrame for the attendance data
    df = pd.DataFrame({'Time of Attendance': timeOfAttendance, 'Student ID': attendance_data, 'First Name': first_names, 'Last Name': last_names})
    
    # Convert DataFrame to Excel bytes buffer
    output = io.BytesIO()
    writer = pd.ExcelWriter(output, engine='xlsxwriter')
    df.to_excel(writer, index=False, sheet_name='Sheet1')

        # Access the XlsxWriter workbook and worksheet objects from the DataFrame writer object
    workbook  = writer.book
    worksheet = writer.sheets['Sheet1']

    # Set the column widths to fit the largest cell in each column
    for i, col in enumerate(df.columns):
        # Find the maximum width of the cells in the column
        max_len = max(df[col].astype(str).map(len).max(), len(col))
        # Set the column width based on the largest cell in the column
        worksheet.set_column(i, i, max_len + 2)
        
    writer._save()
    output.seek(0)
    
    return send_file(output, download_name = sheet_name, as_attachment=True)

@app.route('/get-attendance-list', methods=['GET'])
def get_attendance_list():
    return jsonify({'attendanceList': list(zip(timeOfAttendance, attendance_data, first_names, last_names))})

@app.route('/reset-attendance', methods=['POST'])
def reset_attendance():
    attendance_data.clear()
    first_names.clear()
    last_names.clear()
    timeOfAttendance.clear()
    return jsonify({'message': 'Attendance list reset.'}), 200

if __name__ == '__main__':
    app.run(debug=True)
