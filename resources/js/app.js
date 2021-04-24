/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

//live search for selects - npm-modules
require('../../node_modules/bootstrap-select/dist/js/bootstrap-select.min');


/**
 *  SIDEBAR   
 */
// Hide submenus
$('#body-row .collapse').collapse('hide'); 

// Collapse/Expand icon
$('#collapse-icon').addClass('fa-angle-double-left'); 

// Collapse click
$('[data-toggle=sidebar-colapse]').on('click', function() {
    SidebarCollapse();
});

function SidebarCollapse () {
    $('.menu-collapsed').toggleClass('d-none');
    $('.sidebar-submenu').toggleClass('d-none');
    $('.submenu-icon').toggleClass('d-none');
    $('#sidebar-container').toggleClass('sidebar-expanded sidebar-collapsed');
    
    // Treating d-flex/d-none on separators with title
    var SeparatorTitle = $('.sidebar-separator-title');
    if ( SeparatorTitle.hasClass('d-flex') ) {
        SeparatorTitle.removeClass('d-flex');
    } else {
        SeparatorTitle.addClass('d-flex');
    }
    
    // Collapse/Expand icon
    $('#collapse-icon').toggleClass('fa-angle-double-left fa-angle-double-right');
}



/**
 * add listener to given row for price refreshing when creting order
 */
function updateOrderPrice() {
    var priceSum = 0;
    $('.totalPrice').toArray().forEach(element => {
        priceSum += parseFloat(element.value);
    });

    $('.priceTag').html(priceSum.toFixed(2));
    $('#orderPrice').val(priceSum.toFixed(2));
}

function updateRowPrices(row) {
    $(row).on('change', function(){
        let selOption = $(row).find('option:selected');
        let amount = $(row).find('.amount').val();

        $(row).find('.price').val(selOption.data('price'));
        $(row).find('.totalPrice').val((selOption.data('price')*amount).toFixed(2));

        updateOrderPrice();
    });
}


/**
 * add listener to given row for enabling 'amount' input when product is choosed
 */
function enableAmount(row) {
    row.find('.product').on('change', function() {
        row.find('.amount').prop( "disabled", false);
    });
}


/**
 * add deleting functionality to given delete link on row[rowIndx]  
 */
function deleteRow(rowIdx) {
    $('#delete_R'+rowIdx).on('click', function(event) {
        event.preventDefault();

        let row = $('#R'+rowIdx);
        row.remove();

        updateOrderPrice();
    });
} 


/**
 * add event listeners to all rows when page is loaded
 */ 
var orderRows = $('tbody').find('tr');

orderRows.each(function(index, value) {
    updateRowPrices($(value));
    enableAmount($(value));
    deleteRow(index);
});


/**
 * ORDER TABLE - add new row to order
 */
var rowIdx = orderRows.toArray().length; //set index to last row + 1
var table = $("#orderTable").find('tbody');

$('#addToOrder').on('click', function(event) {
    event.preventDefault();

    table.append(
    `
    <tr class="d-flex" id="R${rowIdx}">
        <td class="col-4">
            <select class="form-control product" data-live-search="true"  name="product[]">
            
            </select>
        </td>

        <td class="col-2">
            <div class="form-group">
                <input type="number" step="0.01" min="0" min class="form-control price" value="0" readonly>
            </div>
        </td>

        <td class="col-2">
            <div class="form-group">
                <input type="number" step="1" min="1" class="form-control amount" value="1" name="amount[]" disabled>
            </div>  
        </td>

        <td class="col-3">
            <div class="form-group">
                <input type="number" step="0.01" min="0" class="form-control totalPrice" value="0" readonly>
            </div>  
        </td>

        <td class="col-1">
            <div class="form-group">
                <a href="#" class="btn btn-danger btn-sm" id="delete_R${rowIdx}"><i class="fas fa-trash-alt"></i></a>
            </div>  
        </td>
    </tr>
    `); 

    //add options to product select
    var select = $('#R'+rowIdx).find('.product');
    
    $('#productOpt option').each(function(){
        var option = this;
        select.append(option.outerHTML);
    });

    //add live search to select
    select.selectpicker();
    

    //add event listener for delete button to the new row
    deleteRow(rowIdx);

    
    var row = $('#R'+rowIdx);
    
    //add event listener for price refreshing to the new row
    updateRowPrices(row);

    //add event listener for price refreshing to the new row
    enableAmount(row);

    rowIdx++;
});


//update order price when form submitted
$('#orderForm').on('submit', function(){
    updateOrderPrice();
});

//live search for selects
$(function () {
    $('select').filter(":visible").selectpicker();
});


//charts time period updating
$('#charts-wrapper').on('click', 'a', function(e) {
    if ( this.parentElement.dataset.chart == 'salesChart' ) {
        var editChart = salesChart;
    } else if ( this.parentElement.dataset.chart == 'ordersChart' ) {
        var editChart = ordersChart;
    };
    
    $.ajax({
        url: $(this).attr("href"),
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            editChart.chart.data.labels = data.labels;
            editChart.chart.data.datasets[0].data = data.data;
            editChart.chart.update();
        },
        error: function(data) {
            console.log('ajax error: ' + data);
        }
    });

    let groupButtons = $(this).parent().find('a');
    groupButtons.removeClass('active');
    $(this).addClass('active'); 

    e.preventDefault();
})

//show-hide order details
$('#orderList').on('click', '.orderDetails', function(event) {
    $(this).closest('tr').next().toggle();
    event.preventDefault();
});



    