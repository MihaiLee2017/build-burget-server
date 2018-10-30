import db from '../mongodb'
let recordSchema = db.Schema({
  type: String,
  tPrice: Number,
  uPrice: Number,
  quantity: String,
  payer: String,
  createTime: { type: Date, default: Date.now },
  payerTime: { type: Date, default: Date.now },
  state: String,
  describe: String
})
recordSchema.statics.findByType = function(type, cb) {
  return this.find({ type: type }, cb)
}
export default db.model('record', recordSchema)
