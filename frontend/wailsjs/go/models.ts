export namespace services {
	
	export class TopProduct {
	    Name: string;
	    Price: number;
	
	    static createFrom(source: any = {}) {
	        return new TopProduct(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Name = source["Name"];
	        this.Price = source["Price"];
	    }
	}

}

