const clientId = 'zmZF2QQzZLHF5C6F9rvKzw';
const secret = 'dTWAUX4Q9UQyHP8aWdS0xfU4DB5UHd7eyxI4bvwooCJMHe3pbGPWrIeCw8uqbaU2';
let accessToken ='';

const Yelp = {
  getAccessToken(){
    if (accessToken) {
      return new Promise(resolve => resolve(accessToken));
    }
    return (
      fetch(`https://cors-anywhere.herokuapp.com/https://api.yelp.com/oauth2/token?grant_type=client_credentials&client_id=${clientId}&client_secret=${secret}`, {
        method: 'POST',
        //body: JSON.stringify({id: '200'})
      }).then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Request failed!');
      }, networkError => console.log(networkError.message)).then(jsonResponse => accessToken = jsonResponse.access_token)
    );
  },

  search(term,location,sortBy) {
   return (
     Yelp.getAccessToken().then(()=>{
       return(
         fetch(`https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=${term}&location=${location}&sort_by=${sortBy}`, {
           headers:{
           Authorization: `Bearer ${accessToken}`
           //body: JSON.stringify({id: '200'})
           }
         }).then(response => {
           if (response.ok) {
             return response.json();
           }
           throw new Error('Request failed!');
         }, networkError => console.log(networkError.message)).then(jsonResponse => {
           if(jsonResponse.businesses){
             return jsonResponse.businesses.map(business=> {
               return(
               {
                 id: business.id,
                 imageSrc: business.image_url,
                 name: business.name,
                 address: business.location.address1,
                 city: business.location.city,
                 state: business.location.state,
                 zipCode: business.location.zip_code,
                 category: business.categories.title,
                 rating: business.rating,
                 reviewCount: business.review_count
               })
             });
           }
         })
       )
     })
   )
  }

}
export default Yelp;
