function YelpListing () {
    this.name           = "";   //Name of this business
    this.id             = "";   //Yelp ID for this business
    this.img_url        = "";   //URL of photo for this business
    this.yelp_url       = "";   //URL for business page on Yelp
    this.phone          = "";   //Phone number for this business formatted
    this.review_count   = 0;    //Number of reviews for this business
    this.rating         = 5;    //Rating for this business (0-5)
    this.rating_img_url = "";   //url to starts rating for this business
    this.address        = "";   //location.display_address from yelp
    this.city           = "";   //City for this business
    this.zip            = "";   //Postal code for this business
    this.snippet        = "";   //Snippet text associated with this business
    //Provides a list of category name, alias pairs that this business is associated with. For example,
    //[["Local Flavor", "localflavor"], ["Active Life", "active"], ["Mass Media", "massmedia"]]
    this.categories     = [];
    this.asString = function() {
        return this.name + ' ' + this.id + ' testing';
    };
}

/*
 * Example creation of a new listing object
 *      var alisting = new YelpListing();
 *      alisting.name = "Changing the name";
*/