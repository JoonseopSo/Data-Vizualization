/**
*	### import in html ###
*
*	<script src="browser_kmeans.js"></script>
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
!function(k){function O(r,e){var n=r.PM10-e.PM10,t=r.O3-e.O3,O=r.NO2-e.NO2,o=r.SO2-e.SO2,r=r.CO-e.CO;return Math.sqrt(n*n+t*t+O*O+o*o+r*r)}function o(r){let e=0,n=0,t=0,O=0,o=0;if(!(r.length<=0))return r.forEach(r=>{e+=r.PM10,n+=r.O3,t+=r.NO2,O+=r.SO2,o+=r.CO}),e/=r.length,n/=r.length,t/=r.length,O/=r.length,o/=r.length,{PM10:e,O3:n,NO2:t,SO2:O,CO:o}}k.means=function(r,e){!Array.isArray(e)&&isNaN(e)&&console.error("Parameter k should be of type 'number' or 'array'. But k is "+typeof e),"number"==typeof e&&(e=function(r){let e=[];for(;0<r;r--)e.push({PM10:Math.random(),O3:Math.random(),NO2:Math.random(),SO2:Math.random(),CO:Math.random()});return e}(e));let n=!0;for(;n;){var t=function(t,r,O){let o=!1;return r.forEach((r,e)=>{var n=O(t.filter(r=>r.cluster_index===e));void 0===n||n.PM10===r.PM10&&n.O3===r.O3&&n.NO2===r.NO2&&n.SO2===r.SO2&&n.CO===r.CO||(o=!0,r.PM10=n.PM10,r.O3=n.O3,r.NO2=n.NO2,r.SO2=n.SO2,r.CO=n.CO)}),{centroids:r,centroids_changed:o}}(r=function(r,e,O){return r.forEach(n=>{let t=Number.MAX_VALUE;e.forEach((r,e)=>{r=O(n,r);r<t&&(t=r,n.cluster_index=e)})}),r}(r,e,O),e,o);e=t.centroids,n=t.centroids_changed}return{datapoints:r,centroids:e}}}("undefined"==typeof k&&(k={}));