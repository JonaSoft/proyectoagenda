class EventManager {
    constructor() {

        this.actualizar();
        //$('.calendario').fullCalendar('renderEvent')

    }

    actualizar() {
        //this.urlBase = "/events"
        //this.urlBase = "/calendar"
        this.obtenerDataInicial()
        this.inicializarFormulario()
        this.guardarEvento()
    }



    obtenerDataInicial() {
        let usermail = document.getElementById('usermail').value
            //let url = "/calendar/events"+usemail

        $.get('/calendar/' + usermail, (response) => {
            this.inicializarCalendario(response)
        })
    }

    eliminarEvento(evento) {

        let eventId = evento._id
        console.log(eventId)
        $.post('/calendar/delete/' + eventId, { id: eventId }, (response) => {
            alert(response)

        })
    }
    invocaSignup() {
        $('#signup').on('click', function() {
            console.log('invocando al signup');
        })
    }
    guardarEvento() {
        $('.addButton').on('click', (ev) => {
            let usermail = document.getElementById('usermail').value;
            ev.preventDefault()
            console.log('usuario', usermail)
            var nombre = $('#titulo').val(),
                start = $('#start_date').val(),
                title = $('#titulo').val(),
                end = '',
                start_hour = '',
                end_hour = '';
            usermail = usermail
            var allDay = true;
            if (!$('#allDay').is(':checked')) {
                end = $('#end_date').val()
                start_hour = $('#start_hour').val()
                end_hour = $('#end_hour').val()
                start = start + 'T' + start_hour
                end = end + 'T' + end_hour;
                allDay = false;
                usermail = usermail
            }
            let url = "/calendar/new"
            console.log(url)

            if (title != "" && start != "") {
                if (!$('#allDay').is(':checked') && (start_hour = '' || end_hour == '' || end == '')) {
                    alert("Complete los campos de hora y fecha de finalización del evento")
                } else {

                    let ev = {
                        title: title,
                        allDay: allDay,
                        start: start,
                        end: end,
                        usermail: usermail
                    }
                    $.post(url, ev, (response) => {
                        console.log('id del nuevo evento', response)
                        if (response.length > 4) {
                            alert("Se ha añadido un evento.");
                            ev.id = (response);
                            console.log(ev.id)
                            $('.calendario').fullCalendar('renderEvent', ev)
                        } else {
                            alert("No se ha añadido un evento.")
                        }
                    })

                    this.vaciarVariables();
                    //$('.calendario').fullCalendar('renderEvent', ev)               

                }
            } else {
                alert("Complete los campos obligatorios para el evento")
            }
        })
    }

    vaciarVariables() {

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
        $('#allDay').on('change', function() {
            if (this.checked) {
                $('.timepicker, #end_date').attr("disabled", "disabled")
            } else {
                $('.timepicker, #end_date').removeAttr("disabled")
            }
        })
    }


    actualizarEvento(evento) {
        console.log('moviendo evento', evento)
        let ev = {
            id: evento._id,
            start: new Date(evento.start),
            end: new Date(evento.end)
        }
        console.log(ev)
        const { id, start, end } = ev
        //let url = "/calendar/update"
        let idItem = ev.id
        console.log('item a mover', id, start, end)
        $.post('/calendar/update:' + idItem, ev, (response) => {
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
            eventDragStart: (event, jsEvent) => {
                $('.delete').find('img').attr('src', "../img/trash-open.png");
                $('.delete').find('img').css('width', '80px');
                $('.delete').find('img').css('height', '60px');
                $('.delete').find('img').css('align-item', 'center');
                //$('.delete').find('img').css('margin-right', '-15px');
                $('.delete').css('background-color', '#8B0913')
                    //console.log('nuevosEvent',jsEvent)
            },
            eventDragStop: (event, jsEvent) => {
                $('.delete').find('img').attr('src', "../img/delete.png");
                $('.delete').find('img').css('width', '80px');
                $('.delete').find('img').css('height', '60px');
                //$('.delete').find('img').css('height', '48px');
                $('.delete').css('background-color', '#8B0913');



                var trashEl = $('.delete');
                var ofs = trashEl.offset();
                var x1 = ofs.left;
                var x2 = ofs.left + trashEl.outerWidth(true);
                var y1 = ofs.top;
                var y2 = ofs.top + trashEl.outerHeight(true);
                if (jsEvent.pageX >= x1 && jsEvent.pageX <= x2 &&
                    jsEvent.pageY >= y1 && jsEvent.pageY <= y2) {
                    this.eliminarEvento(event)
                    $('.calendario').fullCalendar('removeEvents', event._id);
                    //$('.calendario').fullCalendar('renderEvent', ev)   

                }
            }
        })
    }
}

const Manager = new EventManager()


$(function() {
    $('#allDay').change(function() {
        if ($('#allDay').is(':checked')) {
            $('#end_date').val('');
            $('#start_hour').val('');
            $('#end_hour').val('');
        }
    })
})