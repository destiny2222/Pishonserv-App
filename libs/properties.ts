

export const config = {

};



export async function getLastestProperties() {
    // Fetch or generate data here
    const properties = [
        // Example property data
        { id: 1, title: "Modern Apartment", location: "New York", price: "$3000/mo" },
        { id: 2, title: "Cozy Cottage", location: "San Francisco", price: "$2500/mo" },
    ];
    return properties;
}