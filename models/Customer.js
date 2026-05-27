//models/Customer.js

/**
 * Factory function to enfore strict data structre for MEC-12
 * This ensures every JSON record written to disk maps perfectly to our requirements.
 *
 */

function createCustomerRecord(data){
    return{
        customerName: String(data.customerName || '').trim(),
        phone: String(data.phone || '').trim(),
        email: String(data.email || '').trim(),
        carYear: parseInt(data.carYear, 10) || 0,
        carMake: String(data.carMake || '').trim(),
        carModel: String(data.carModel || '').trim(),
        vin: parseInt(data.vin,10) || 0,
        storeRepairSubject: String(data.storeRepairSubject || '').trim(),
        createAt: data.createAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
}
module.exports = createCustomerRecord;