async function loadParam(param) {
    let response = await fetch('https://sales-forecast-api.herokuapp.com/params/' + param);
    let jsonData = await response.json();
    return jsonData;
}

function loadParamToStore(dataArray, params) {
    for(let i = 0; i < params.length; i++){
        const selectBox = document.getElementById(params[i]);
        const resultSet = JSON.parse(dataArray[i].result.replaceAll("'", '"'));
        
        resultSet.forEach((data) => {
            const newOption = document.createElement('option');
            const optionText = document.createTextNode(data);
            // set option text
            newOption.appendChild(optionText);
            // and option value
            newOption.setAttribute('value', optionText.nodeValue);
            selectBox.appendChild(newOption);
        });
    }
}

function validate(body) {
    errors = [];
    if(body.item_weight < 0 || isNaN(body.item_weight)) 
        errors.push("Item Weight cannot be empty or negative and should be less than 50kg");
    if(body.item_mrp < 0 || isNaN(body.item_mrp)) 
        errors.push("Item MRP cannot be empty or negative");
    if(body.item_visibility < 0 || body.item_visibility > 1 || isNaN(body.item_visibility))
        errors.push("Item Visibility should be in between 0 to 1 and cannot be empty");
    if(body.outlet_establishment_year < 1950 || body.outlet_establishment_year > 2022 || isNaN(body.outlet_establishment_year)) 
        errors.push("Outlet Establishment Year should be in between 1950 to 2022  and cannot be empty");

    dropdownVals = ['item_identifier', 'item_fat_content', 'item_type', 'outlet_identifier', 'outlet_size', 'outlet_location_type', 'outlet_type']

    dropdownVals.forEach(val => {
        if(body[val] === "") errors.push("Please select a value for the empty field " + val);
    })

    if(errors.length > 0)
        return errors;
    return ["OK"];
}

async function predict(body) {
    let response = await fetch('https://sales-forecast-api.herokuapp.com/predict', {
        method: 'POST',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
    let jsonData = await response.json();
    console.log(jsonData);

    const predictionDiv = document.querySelector(".prediction");
    predictionDiv.innerHTML = `<div class="alert alert-success">Prediction: ${jsonData.predicted_sales}</div>`
}

function predictSales(e) {
    e.preventDefault();
    const itemIdentifier = document.querySelector("#item_identifier").value;
    const itemWeight = document.querySelector("#item_weight").value;
    const itemFatContent = document.querySelector("#item_fat_content").value;
    const itemVisibility = document.querySelector("#item_visibility").value;
    const itemType = document.querySelector("#item_type").value;
    const itemMRP = document.querySelector("#item_mrp").value;
    const outletIdentifier = document.querySelector("#outlet_identifier").value;
    const outletEstablishmentYear = document.querySelector("#outlet_establishment_year").value;
    const outletSize = document.querySelector("#outlet_size").value;
    const outletLocationType = document.querySelector("#outlet_location_type").value;
    const outletType = document.querySelector("#outlet_type").value;

    let body = {
        "item_identifier": itemIdentifier,
        "item_weight": parseInt(itemWeight),
        "item_fat_content": itemFatContent,
        "item_visibility": parseFloat(itemVisibility),
        "item_type": itemType,
        "item_mrp": parseFloat(itemMRP),
        "outlet_identifier": outletIdentifier,
        "outlet_establishment_year": parseInt(outletEstablishmentYear),
        "outlet_size": outletSize,
        "outlet_location_type": outletLocationType,
        "outlet_type": outletType
    };

    console.log(body);
    const errorDiv = document.querySelector(".error");
    const message = validate(body);
    if(message[0] !== "OK"){
        errorDiv.innerHTML = "";
        message.forEach(item => {
            const node = document.createElement("div");
            node.className = "alert alert-danger";
            node.innerHTML = item;

            errorDiv.appendChild(node);
        })
    } else {
        errorDiv.innerHTML = "";
    }

    predict(body);
}

(async function(){
    const dataArray = new Array();
    const params = ['item_identifier', 'item_fat_content', 'item_type', 'outlet_identifier', 'outlet_size', 'outlet_location_type', 'outlet_type'];
    
    for(let i = 0; i < params.length; i++){
        dataArray.push(await loadParam(params[i]));
    }

    // console.log(dataArray);
    loadParamToStore(dataArray, params);
})();
