const getNearby = async (lat, lng) => {
    let url = `https://segdeha.com/api/nearby.php?lat=${lat}&lng=${lng}`;
    let response = await fetch(url);

    if (response.ok) { // if HTTP-status is 200-299
        // get the response body (the method explained below)
        let json = await response.json();
        return json;
    }
    else {
        console.error(`HTTP Error: ${response.status}`);
        return {
            status: 400,
            query: {
                pages: []
            }
        };
    }
};

export default getNearby;
