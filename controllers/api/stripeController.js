const Stripe = require('stripe');
const stripe = Stripe('sk_test_51HyVQKIOdDwoZMJbvmjYdDWfnJphnYYJv970kC7kgTSssUnwdv95SHqJPQp8rjDDCSkW2RkFW9rXR8shV6Dg52fo00zWqcKMBg');

exports.stripe = async(req,res) =>{
    const token = await stripe.tokens.create({
        card: {
          number: req.body.cardno,
          exp_month: req.body.exp_month,
          exp_year: req.body.exp_year,
          cvc: req.body.cvc,
        },
      });
      const customer = await stripe.customers.create({
        source: token.id,
        // email: 'paying.user@example.com',
      });
    const charge = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: 'inr',
        customer: customer.id,
        description: 'My First Test Charge (created for API docs)',
      });
    //   console.log("--charge",charge)
      if(charge) return res.json({message:"Payment",data:charge})
      return res.json({message:"not"})
}
exports.update = async (req,res) =>{




}