const router = require("express").Router();
const Invoice = require("../../../models/Admin/invoice");
const Helper = require("../../helper");

router.post("/invoice", async (req, res) => {
  if (!req.body.invoiceNo) {
    return res.status(400).send("invoice number is empty");
  } else if (!req.body.TotalAmount) {
    return res.status(400).send("TotalAmount is empty");
  } else if (!req.body.Date) {
    return res.status(400).send("Date is empty");
  } else if (!req.body.paymentStatus) {
    return res.status(400).send("paymentStatus is empty");
  }

  let newInvoice = new Invoice({
    invoiceNo: req.body.invoiceNo,
    TotalAmount: req.body.TotalAmount,
    Date: req.body.Date,
    paymentStatus: req.body.paymentStatus,
  });

  try {
    newInvoice = await newInvoice.save();
    return res.send(newInvoice);
  } catch (error) {
    return Helper.badRequest(res, error);
  }
});
router.get("/invoice", async (req, res) => {
  try {
    let invoice = await Invoice.find();
    res.send(invoice);
  } catch (ex) {
    return Helper.badRequest(res, error);
  }
});
router.get("/invoice/:id", async (req, res) => {
  let reqID = req.params.id;
  try {
    let invoice = await Invoice.findById(reqID);
    res.send(invoice);
  } catch (ex) {
    return Helper.badRequest(res, error);
  }
});

module.exports = router;
