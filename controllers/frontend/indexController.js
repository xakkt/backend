

exports.list = async (req, res) => {
    if (req.session.email) {
        return res.render('frontend/index', { data: req.session.email })
    }
    return res.render('frontend/index', { data: '' })
}