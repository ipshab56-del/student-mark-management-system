from core.request import parse_json_body
from core.responses import send_json, send_404
from services.fee_service import FeeService

def get_all_fees(handler):
    try:
        fees = FeeService.get_all()
        send_json(handler, 200, fees)
    except Exception as e:
        send_json(handler, 500, {"error": str(e)})

def get_fee(handler, fee_id):
    try:
        fee = FeeService.get_by_id(fee_id)
        if fee:
            send_json(handler, 200, fee)
        else:
            send_404(handler)
    except Exception as e:
        send_json(handler, 500, {"error": str(e)})

def create_fee(handler):
    try:
        data = parse_json_body(handler)
        fee_id = FeeService.create(data)
        send_json(handler, 201, {"id": fee_id, "message": "Fee created successfully"})
    except Exception as e:
        send_json(handler, 500, {"error": str(e)})

def update_fee(handler, fee_id):
    try:
        data = parse_json_body(handler)
        success = FeeService.update(fee_id, data)
        if success:
            send_json(handler, 200, {"message": "Fee updated successfully"})
        else:
            send_404(handler)
    except Exception as e:
        send_json(handler, 500, {"error": str(e)})

def delete_fee(handler, fee_id):
    try:
        success = FeeService.delete(fee_id)
        if success:
            send_json(handler, 200, {"message": "Fee deleted successfully"})
        else:
            send_404(handler)
    except Exception as e:
        send_json(handler, 500, {"error": str(e)})