/**
*	### import ###
*
*	const { k } = require("./server_kmeans")
*
*
* 	### usage ###
*
*
* k.means(datapoints, k)
* 	datapoints: [
*		     {
*		      PM10: normalized number [0-1],
*		      O3: normalized number [0-1],
*		      SO2: normalized number [0-1],
*		      CO: normalized number [0-1],
*		      NO2: normalized number [0-1],
*              	      ...
*		     },
*		     ...
*		    ]
*	k: Number of centroids to be created
*
*
*
* k.means(datapoints, centroids)
* 	datapoints: [
*		     {
*		      PM10: normalized number [0-1],
*		      O3: normalized number [0-1],
*		      SO2: normalized number [0-1],
*		      CO: normalized number [0-1],
*		      NO2: normalized number [0-1],
*              	      ...
*		     },
*		     ...
*		    ]
* 	centroids[
*		     {
*		      PM10: normalized number [0-1],
*		      O3: normalized number [0-1],
*		      SO2: normalized number [0-1],
*		      CO: normalized number [0-1],
*		      NO2: normalized number [0-1],
*              	      ...
*		     },
*		     ...
*		    ]
*
*
*	##### return value ###
*
*	Both return an object -> { datapoints, centroids }
*	Each element in datapoint has an additional property "cluster_index" from 0 to (k-1)
*	cluster_index = 3 means that datapoint is assigned to cluster with index 3 ( centroids[3] )
*
*
*/
!function(){function O(r,t){var e=r.PM10-t.PM10,n=r.O3-t.O3,O=r.NO2-t.NO2,o=r.SO2-t.SO2,r=r.CO-t.CO;return Math.sqrt(e*e+n*n+O*O+o*o+r*r)}function o(r){let t=0,e=0,n=0,O=0,o=0;if(!(r.length<=0))return r.forEach(r=>{t+=r.PM10,e+=r.O3,n+=r.NO2,O+=r.SO2,o+=r.CO}),t/=r.length,e/=r.length,n/=r.length,O/=r.length,o/=r.length,{PM10:t,O3:e,NO2:n,SO2:O,CO:o}}module.exports={k:{means(r,t){!Array.isArray(t)&&isNaN(t)&&console.error("Parameter k should be of type 'number' or 'array'. But k is "+typeof t),"number"==typeof t&&(t=function(r){let t=[];for(;0<r;r--)t.push({PM10:Math.random(),O3:Math.random(),NO2:Math.random(),SO2:Math.random(),CO:Math.random()});return t}(t));let e=!0;for(;e;){var n=function(n,r,O){let o=!1;return r.forEach((r,t)=>{var e=O(n.filter(r=>r.cluster_index===t));void 0===e||e.PM10===r.PM10&&e.O3===r.O3&&e.NO2===r.NO2&&e.SO2===r.SO2&&e.CO===r.CO||(o=!0,r.PM10=e.PM10,r.O3=e.O3,r.NO2=e.NO2,r.SO2=e.SO2,r.CO=e.CO)}),{centroids:r,centroids_changed:o}}(r=function(r,t,O){return r.forEach(e=>{let n=Number.MAX_VALUE;t.forEach((r,t)=>{r=O(e,r);r<n&&(n=r,e.cluster_index=t)})}),r}(r,t,O),t,o);t=n.centroids,e=n.centroids_changed}return{datapoints:r,centroids:t}}}}}();