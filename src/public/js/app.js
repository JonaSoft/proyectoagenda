
class EventManager {
    constructor() {        
        this.actualizar();
    }

    actualizar(){        
        //this.urlBase = "/events"
        this.urlBase = "/calendar"
        this.obtenerDataInicial()
        this.inicializarFormulario()
        this.guardarEvento()
    }

    

    obtenerDataInicial() {
        let url = this.urlBase + "/all"
        $.get(url, (response) => {
            this.inicializarCalendario(response)
        })
    }

    eliminarEvento(evento) {
        let eventId = evento.id
        $.post('/events/delete/'+eventId, {id: eventId}, (response) => {
            alert(response)
                    
        })

        
    }

    guardarEvento() {
        $('.addButton').on('click', (ev) => {
            ev.preventDefault()
            let nombre = $('#titulo').val(),
            start = $('#start_date').val(),
            title = $('#titulo').val(),
            end = '',
            start_hour = '',
            end_hour = '';
            var allDay = true;
            if (!$('#allDay').is(':checked')) {
                end = $('#end_date').val()
                start_hour = $('#start_hour').val()
                end_hour = $('#end_hour').val()
                start = start + 'T' + start_hour
                end = end + 'T' + end_hour;
                allDay= false;
            }
            let url = this.urlBase + "/new"
            
            if (title != "" && start != "") {
                if (!$('#allDay').is(':checked')  && (start_hour='' || end_hour=='' || end =='' ) ){
                    alert("Complete los campos de hora y fecha de finalización del evento") 
                }else{

                    let ev = {
                    //id:0,
                    title: title,
                    allDay:allDay,
                    start: start,
                    end: end
                    }
                    $.post(url, ev, (response) => {
                        console.log('id del nuevo evento',response)
                        if (parseInt(response)>0){
                            alert("Se ha añadido un evento.");
                            ev.id = parseInt(response);
                            $('.calendario').fullCalendar('renderEvent', ev)
                        }else{
                            alert("No se ha añadido un evento.")
                        }                            
                    })     

                    this.vaciarVariables();               

                }
            } else {
                alert("Complete los campos obligatorios para el evento")
            }
        })
    }

    vaciarVariables(){
        
       $('#titulo').val('');
       $('#start_date').val('');
       $('#allDay').prop('checked', false);
       $('#end_date').val('');
       $('#start_hour').val('')
       $('#end_hour').val('')
    }

    inicializarFormulario() {
        $('#start_date, #titulo, #end_date').val('');
        $('#start_date, #end_date').datepicker({
            dateFormat: "yy-mm-dd"
        });
        $('.timepicker').timepicker({
            timeFormat: 'HH:mm:ss',
            interval: 30,
            minTime: '5',
            maxTime: '23:59:59',
            defaultTime: '',
            startTime: '5:00',
            dynamic: false,
            dropdown: true,
            scrollbar: true
        });
        $('#allDay').on('change', function(){
            if (this.checked) {
                $('.timepicker, #end_date').attr("disabled", "disabled")
            }else {
                $('.timepicker, #end_date').removeAttr("disabled")
            }
        })
    }


    actualizarEvento(evento) {    
        let ev = {
            id:evento.id,
            start:new Date(evento.start),
            end:new Date(evento.end)
                }
        let url = this.urlBase + "/update"
        
        $.post(url, ev, (response) => {
             alert(response);
        });               
    }


   

    inicializarCalendario(eventos) {
        $('.calendario').fullCalendar({
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,basicDay'
            },
            defaultDate: '2020-02-05',
            navLinks: true,
            editable: true,
            eventLimit: true,
            droppable: true,
            dragRevertDuration: 0,
            timeFormat: 'H:mm',
            eventDrop: (event) => {
                
                this.actualizarEvento(event)
            },
            events: eventos,
            eventDragStart: (event,jsEvent) => {
                $('.delete').find('img').attr('src', "trash-open.png");
                $('.delete').css('background-color', '#a70f19')
            },
            eventDragStop: (event,jsEvent) => {
                $('.delete').find('img').attr('src', "delete.png");
                $('.delete').css('background-color', '#a70f19')
                
                var trashEl = $('.delete');
                var ofs = trashEl.offset();
                var x1 = ofs.left;
                var x2 = ofs.left + trashEl.outerWidth(true);
                var y1 = ofs.top;
                var y2 = ofs.top + trashEl.outerHeight(true);
                if (jsEvent.pageX >= x1 && jsEvent.pageX<= x2 &&
                    jsEvent.pageY >= y1 && jsEvent.pageY <= y2) {                        
                        this.eliminarEvento(event)       
                        
                        $('.calendario').fullCalendar('removeEvents', event._id);
                        
                    }
                }
            })
        }
    }

const Manager = new EventManager()


$(function(){
  $('#allDay').change(function(){    
   if ($('#allDay').is(':checked')) {
       $('#end_date').val('');
       $('#start_hour').val('');
       $('#end_hour').val('')   ;            
    }
})  
    $('#logout').click(function(){
        $.post('/logout', (response) => {
             alert(response);
             window.location.href = "http://localhost:3002/"
        });  

    })

})


