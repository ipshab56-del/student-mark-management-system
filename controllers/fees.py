from core.request import parse_json_body
from core.responses import send_json, send_error
from services.fee_service import FeeService

def get_all_fees(handler):
    try:
        fees = FeeService.get_all()
        send_json(handler, fees)
    except Exception as e:
        send_error(handler, str(e))

def get_fee(handler, fee_id):
    try:
        fee = FeeService.get_by_id(fee_id)
        if fee:
            send_json(handler, fee)
        else:
            send_error(handler, "Fee not found", 404)
    except Exception as e:
        send_error(handler, str(e))

def create_fee(handler):
    try:
        data = parse_json_body(handler)
        fee_id = FeeService.create(data)
        send_json(handler, {"id": fee_id, "message": "Fee created successfully"})
    except Exception as e:
        send_error(handler, str(e))

def update_fee(handler, fee_id):
    try:
        data = parse_json_body(handler)
        success = FeeService.update(fee_id, data)
        if success:
            send_json(handler, {"message": "Fee updated successfully"})
        else:
            send_error(handler, "Fee not found", 404)
    except Exception as e:
        send_error(handler, str(e))

def delete_fee(handler, fee_id):
    try:
        success = FeeService.delete(fee_id)
        if success:
            send_json(handler, {"message": "Fee deleted successfully"})
        else:
            send_error(handler, "Fee not found", 404)
    except Exception as e:
        send_error(handler, str(e))