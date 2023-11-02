function validateName(input){

    let nameRegex = /^[a-zA-Z\ -]+$/

    if(nameRegex.test(input) === true){

        return true

    } else {

        return "That was an invalid response.  A name can only contain letters, spaces, and hyphens.  Try again. "
    }
}

function validateTitle(input){

    let titleRegex = /^[a-zA-Z0-9\ -]+$/

    if(titleRegex.test(input) === true){

        return true
    
    } else {

        return "That was an invalid response.  The title of a department or role can only contain letters, numbers, spaces, and hyphens.  Try again. "
    }
}

function validateSalary(input){

    let titleRegex = /^(?!.*\.$)[0-9]+\.{0,1}[0-9]{0,2}$/

    if(titleRegex.test(input) === true){

        return true
    
    } else {

        return "That was an invalid response.  A salary can only contain numbers, and potentially followed by a period, potentially followed by another two numbers. "
    }
}

module.exports = {validateName, validateSalary, validateTitle};