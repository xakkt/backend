const User = require('../../models/user');

exports.addresslist = async (req, res) => {

    try {

        let user = await User.findOne({ _id: req.decode.id }).lean()


    } catch (err) {
        console.log("--err", err)
        return res.status(404).json({ message: err.message })

    }

}

exports.address = async (req, res) => {

    try {
        let addressinfo = {
            address: req.body.address

        }
        let user = await User.findOneAndUpdate({ _id: req.decode.id }, addressinfo, { returnOriginal: false }).lean()
        if (!user) return res.json({ status: true, message: "Something went wrong" })
        return res.json({ status: true, message: "Data saved successfully" })

    } catch (err) {
        return res.status(404).json({ message: err.message })
    }
}



