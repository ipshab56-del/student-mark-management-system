export class FeeService {
    constructor() {
        this.baseUrl = '/api/fees';
    }

    async getAll() {
        const response = await fetch(this.baseUrl);
        if (!response.ok) throw new Error('Failed to fetch fees');
        return response.json();
    }

    async getById(id) {
        const response = await fetch(`${this.baseUrl}/${id}`);
        if (!response.ok) throw new Error('Failed to fetch fee');
        return response.json();
    }

    async create(feeData) {
        const response = await fetch(this.baseUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(feeData)
        });
        if (!response.ok) throw new Error('Failed to create fee');
        return response.json();
    }

    async update(id, feeData) {
        const response = await fetch(`${this.baseUrl}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(feeData)
        });
        if (!response.ok) throw new Error('Failed to update fee');
        return response.json();
    }

    async delete(id) {
        const response = await fetch(`${this.baseUrl}/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete fee');
        return response.json();
    }
}