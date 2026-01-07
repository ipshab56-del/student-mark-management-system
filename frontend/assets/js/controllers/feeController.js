import { FeeService } from '../services/feeService.js';
import { StudentService } from '../services/studentService.js';
import { showAlert } from '../components/alert.js';

export class FeeController {
    constructor() {
        this.feeService = new FeeService();
        this.studentService = new StudentService();
        this.editingId = null;
    }

    async init() {
        this.bindEvents();
        await this.loadStudents();
        await this.loadFees();
    }

    bindEvents() {
        document.getElementById('feeForm').addEventListener('submit', (e) => this.handleSubmit(e));
        document.getElementById('cancelEdit').addEventListener('click', () => this.cancelEdit());
    }

    async loadStudents() {
        try {
            const students = await this.studentService.getAll();
            const select = document.getElementById('studentId');
            select.innerHTML = '<option value="">Select Student</option>';
            students.forEach(student => {
                select.innerHTML += `<option value="${student.id}">${student.name}</option>`;
            });
        } catch (error) {
            showAlert('Error loading students', 'error');
        }
    }

    async loadFees() {
        try {
            const fees = await this.feeService.getAll();
            const students = await this.studentService.getAll();
            this.renderFeesTable(fees, students);
        } catch (error) {
            showAlert('Error loading fees', 'error');
        }
    }

    renderFeesTable(fees, students) {
        const tbody = document.getElementById('feesTableBody');
        tbody.innerHTML = '';

        fees.forEach(fee => {
            const student = students.find(s => s.id === fee.student_id);
            const statusClass = fee.status === 'paid' ? 'text-green-600' : 
                               fee.status === 'overdue' ? 'text-red-600' : 'text-yellow-600';
            
            tbody.innerHTML += `
                <tr>
                    <td>${fee.id}</td>
                    <td>${student ? student.name : 'Unknown'}</td>
                    <td>$${fee.amount}</td>
                    <td>${fee.due_date}</td>
                    <td><span class="${statusClass} font-semibold">${fee.status}</span></td>
                    <td>${fee.description || '-'}</td>
                    <td>
                        <button onclick="feeController.editFee(${fee.id})" class="text-blue-600 hover:underline mr-2">Edit</button>
                        <button onclick="feeController.deleteFee(${fee.id})" class="text-red-600 hover:underline">Delete</button>
                    </td>
                </tr>
            `;
        });
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = {
            student_id: parseInt(document.getElementById('studentId').value),
            amount: parseFloat(document.getElementById('amount').value),
            due_date: document.getElementById('dueDate').value,
            status: document.getElementById('status').value,
            description: document.getElementById('description').value
        };

        try {
            if (this.editingId) {
                await this.feeService.update(this.editingId, formData);
                showAlert('Fee updated successfully', 'success');
                this.cancelEdit();
            } else {
                await this.feeService.create(formData);
                showAlert('Fee added successfully', 'success');
            }
            
            document.getElementById('feeForm').reset();
            await this.loadFees();
        } catch (error) {
            showAlert('Error saving fee', 'error');
        }
    }

    async editFee(id) {
        try {
            const fee = await this.feeService.getById(id);
            
            document.getElementById('studentId').value = fee.student_id;
            document.getElementById('amount').value = fee.amount;
            document.getElementById('dueDate').value = fee.due_date;
            document.getElementById('status').value = fee.status;
            document.getElementById('description').value = fee.description || '';
            
            this.editingId = id;
            document.querySelector('#feeForm button[type="submit"]').textContent = 'Update Fee';
            document.getElementById('cancelEdit').style.display = 'inline-block';
        } catch (error) {
            showAlert('Error loading fee data', 'error');
        }
    }

    cancelEdit() {
        this.editingId = null;
        document.getElementById('feeForm').reset();
        document.querySelector('#feeForm button[type="submit"]').textContent = 'Add Fee';
        document.getElementById('cancelEdit').style.display = 'none';
    }

    async deleteFee(id) {
        if (confirm('Are you sure you want to delete this fee?')) {
            try {
                await this.feeService.delete(id);
                showAlert('Fee deleted successfully', 'success');
                await this.loadFees();
            } catch (error) {
                showAlert('Error deleting fee', 'error');
            }
        }
    }
}

// Make it globally available
window.feeController = new FeeController();