module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch((e) => {
            next(e)
            console.log(e)
        });
    }
}

// A function that returns the function and execute that function that catches the error next