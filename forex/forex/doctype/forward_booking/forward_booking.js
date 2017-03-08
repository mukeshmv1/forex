// Copyright (c) 2016, FinByz Tech Pvt. Ltd. and contributors
// For license information, please see license.txt

frappe.ui.form.on('Forward Booking', {
	refresh: function(frm) {

	}
});

cur_frm.add_fetch("sales_order", "grand_total", "order_amount");
cur_frm.add_fetch("sales_order", "delivery_date", "delivery_date");
cur_frm.add_fetch("purchase_order", "grand_total", "order_amount");
cur_frm.add_fetch("purchase_order", "delivery_date", "delivery_date");

//Set Default Currency USD
frappe.ui.form.on("Forward Booking", "onload", function(frm) {
	frm.set_value( "currency", "USD");
});

// Set Maturity Date
frappe.ui.form.on("Forward Booking", "maturity_from", function(frm) {
	frm.set_value( "maturity_to", frm.doc.maturity_from);
});
// Validate Maturity to date is > Maturity from
frappe.ui.form.on("Forward Booking", "maturity_to", function(frm) {
    if (frm.doc.maturity_from > frm.doc.maturity_to){
		frm.set_value( "maturity_to", frm.doc.maturity_from);
		msgprint("'Maturity To' date should be greater than or equal to 'Maturity From' date");
	}
});

//Calculate Total Underlying
frappe.ui.form.on("Forward Booking Exp Underlying", "amount_covered", function(frm, cdt, cdn) {
	total = 0;
	$.each(frm.doc.sales_orders || [], function(i, d) {
		total += flt(d.amount_covered);
	});
	frm.set_value("total_underlying", total);
});

frappe.ui.form.on("Forward Booking Imp Underlying", "amount_covered", function(frm, cdt, cdn) {
	total = 0;
	$.each(frm.doc.purchase_orders || [], function(i, d) {
		total += flt(d.amount_covered);
	});
	frm.set_value("total_underlying", total);
});

// Filter Purchase & Sales Order
cur_frm.fields_dict.sales_orders.grid.get_field("sales_order").get_query = function(doc) {
	return {
		filters: {
			"docstatus": 1,
			"currency": doc.currency,
		}
	}
};

cur_frm.fields_dict.purchase_orders.grid.get_field("purchase_order").get_query = function(doc) {
	return {
		filters: {
			"docstatus": 1,
			"currency": doc.currency,
		}
	}
};

// Set Status as closed if No outstanding
frappe.ui.form.on("Forward Booking", "validate", function(frm) {
    if (frm.doc.amount_outstanding <= 0){
		frm.set_value( "status", "Closed");
	}
});
frappe.ui.form.on("Forward Booking", "validate", function(frm) {
    if (frm.doc.amount_outstanding > 0){
		frm.set_value( "status", "Open");
	}
});

//Calculate INR Amount
frappe.ui.form.on("Forward Booking Cancellation", "cancel_amount", function(frm,cdt,cdn) {
	calculate_inramt(frm,cdt,cdn);
});
frappe.ui.form.on("Forward Booking Cancellation", "rate", function(frm,cdt,cdn) {
    	calculate_inramt(frm,cdt,cdn);
});

var calculate_inramt = function(frm,cdt,cdn) {
	var d = locals[cdt][cdn];
    inramt =  flt(d.cancel_amount)*flt(d.rate);
     frappe.model.set_value(cdt,cdn,"inr_amount", inramt);
};


//Calculate Total Cancelled Amount & Average Rate
frappe.ui.form.on("Forward Booking Cancellation", "cancel_amount", function(frm, cdt, cdn) {
	total = 0;
	inr_total = 0;
	$.each(frm.doc.cancellation_details || [], function(i, d) {
		total += flt(d.cancel_amount);
		inr_total += flt(d.inr_amount);
	});
	frm.set_value("total_cancelled", total);
	frm.set_value("can_avg_rate", inr_total/total);
});

frappe.ui.form.on("Forward Booking Cancellation", "inr_amount", function(frm, cdt, cdn) {
	total = 0;
	inr_total = 0;
	$.each(frm.doc.cancellation_details || [], function(i, d) {
		total += flt(d.cancel_amount);
		inr_total += (flt(d.cancel_amount)*flt(d.rate));
	});
	frm.set_value("total_cancelled", total);
	frm.set_value("can_avg_rate", inr_total/total);
});

frappe.ui.form.on("Forward Booking", {
	validate: function(frm) {
		total = 0;
		inr_total = 0;
		$.each(frm.doc.cancellation_details || [], function(i, d) {
			total += flt(d.cancel_amount);
			inr_total += flt(d.inr_amount);
		});
		frm.set_value("total_cancelled", total);
		frm.set_value("can_avg_rate", inr_total/total);
	}
});

//Calculate Cancellation Loss Profit
frappe.ui.form.on("Forward Booking", "can_avg_rate", function(frm) {
    calculate_rate_diff(frm);
});
frappe.ui.form.on("Forward Booking", "validate", function(frm) {
    calculate_rate_diff(frm);
});
var calculate_rate_diff = function(frm) {
    if (frm.doc.hedge == "Export") {
		var rate_diff = flt(frm.doc.booking_rate) - flt(frm.doc.can_avg_rate);
	}
	else {
		var rate_diff = flt(frm.doc.can_avg_rate) - flt(frm.doc.booking_rate);
	}
    frm.set_value("rate_diff", rate_diff);
    frm.set_value("diff_amount", rate_diff*flt(frm.doc.total_cancelled));
}


//Calculate Outstanding Amount
frappe.ui.form.on("Forward Booking", "amount", function(frm) {
    calculate_outstanding(frm);
});

frappe.ui.form.on("Forward Booking", "validate", function(frm) {
    calculate_outstanding(frm);
});

frappe.ui.form.on("Forward Booking", "total_utilization", function(frm) {
    calculate_outstanding(frm);
});

frappe.ui.form.on("Forward Booking", "total_cancelled", function(frm) {
    calculate_outstanding(frm);
});

var calculate_outstanding = function(frm) {
    var outstanding = flt(frm.doc.amount) - flt(frm.doc.total_utilization)-flt(frm.doc.total_cancelled);
    frm.set_value("amount_outstanding", outstanding);
}