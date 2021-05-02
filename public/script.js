$(document).ready(() => {
 
    const $productDiv = $('#products');
   
    $.get('/products').then(response => {
   
      let template = `<ul class="Polaris-ResourceList">`;
      
      $.each(response.edges, function(i, edge) {
        template += `<li class="Polaris-ResourceList__ItemWrapper">
                       <div class="Polaris-ResourceItem Polaris-ResourceItem--persistActions">
                         <a class="Polaris-ResourceItem__Link" data-polaris-unstyled="true"></a>
                           <div class="Polaris-ResourceItem__Container">
                             <div class="Polaris-ResourceItem__Content">
                               <h3><span class="Polaris-TextStyle--variationStrong">${edge.node.title}</span></h3>
                             </div>
                           </div>
                       </div>
                     </li>`;
       });
   
       template += `</ul>`;
   
       $productDiv.append(template);
   
    });
  });