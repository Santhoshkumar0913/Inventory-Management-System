const API_BASE = "http://localhost:7071/api";

async function getData(endpoint){

    const response = await fetch(`${API_BASE}/${endpoint}`);

    return await response.json();

}

async function postData(endpoint,data){

    const response = await fetch(`${API_BASE}/${endpoint}`,{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify(data)

    });

    return await response.json();

}