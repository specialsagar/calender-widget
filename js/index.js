
        var monthNames = {
            0: "January",
            1: "February",
            2: "March",
            3: "April",
            4: "May",
            5: "June",
            6: "July",
            7: "August",
            8: "September",
            9: "October",
            10: "November",
            11: "December"
        }
        // define the number of years you want to display from start
        var lengthOfPreviousYears = 10;
        var lengthOfFutureYears = 10;
        var years = {};

        function generateYearData() {
          var currentYear = new Date().getFullYear();
          var startYear = currentYear - lengthOfPreviousYears;
          var i = 0;
          for(i; i<lengthOfPreviousYears; i++){
              years[i] = startYear;
              startYear++;
          }
          for(var j = 0; j<lengthOfFutureYears; j++, i++){
            years[i] = startYear;
            startYear++;
          }
        }
        generateYearData();
        function Cal() {
            this.date = {};
            this.markup = {};
            this.date.today = new Date();
            this.date.today = new Date(this.date.today.getUTCFullYear(),this.date.today.getUTCMonth(),this.date.today.getUTCDate());
            this.date.browse = new Date();
            this.markup.row = "row";
            this.markup.cell = "cell";
            this.markup.inactive = "g";
            this.markup.currentMonth = "mn";
            this.markup.currentYear = "yy"
            this.markup.slctd = "slctd";
            this.markup.today = "today";
            this.markup.dayArea = "dayArea";
            this.elementTag = 'calendar';
            this.targetInput = '.date-picker';
            this.init = false;
            this.selectDate(this.date.today.getFullYear(),this.date.today.getMonth(),this.date.today.getDate());
            this.buildYearDOM();

            t = this;
            $(document).ready(function(){
                $(document).click(function(ms){
                    e = $('.'+t.elementTag+' .view');
                    eco = e.offset();
                    if(ms.pageX<eco.left || ms.pageX>eco.left+e.width() || ms.pageY<eco.top || ms.pageY>eco.top+e.height()) {
                        if(!t.init) t.hide(300);
                    }
                });
                $('.'+t.elementTag).on('click','.next-month',function(){
                    t.setMonthNext();
                });
                $('.'+t.elementTag).on('click','.prev-month',function(){
                    t.setMonthPrev();
                });
                $('.'+t.elementTag).on('click','.next-year',function(){
                    t.setYearNext();
                });
                $('.'+t.elementTag).on('click','.prev-year',function(){
                    t.setYearPrev();
                });

                $('.'+t.elementTag).on('click','.jump-to-next-month',function(){
                    t.setMonthNext();
                });
                $('.'+t.elementTag).on('click','.jump-to-previous-month',function(){
                    t.setMonthPrev();
                });

                $('.'+t.elementTag).on('click','.'+t.markup.currentMonth,function(){
                    d = t.selectDate(t.date.browse.getUTCFullYear(),t.date.browse.getUTCMonth(),$(this).html());
                    t.hide(300);
                });

                $('.'+t.elementTag).on('click','.'+t.markup.currentYear,function(){
                    t.date.browse = new Date($(this).html(),0,1);
                    t.buildMonthDOM();
                    t.constructDayArea(false);
                });

                $('.'+t.elementTag).on('click','.title.month-title',function(){
                    t.date.browse = new Date(t.date.today.getTime());
                    t.constructDayArea(false);
                });


                $(t.targetInput).focus(function(){
                    t.show(100);
                    $(this).blur();
                });

            });


        }
        Cal.prototype.wd = function(wd) {
            return wd
        }
        Cal.prototype.buildMonthDOM = function() {
            $(".clear").remove();
            html = "<div class='clear "+this.elementTag+"'>" +
              "<div class='view'>" +
              "<div class='head'>" +
              "<div class='title month-title'><span class='m'></span> <span class='y'></span></div>" +
            "</div>";
            html += "<div class='row th'>" +
              "<div class='C'>M</div>" +
              "<div class='C'>T</div>" +
              "<div class='C'>W</div>" +
              "<div class='C'>T</div>" +
              "<div class='C'>F</div>" +
              "<div class='C'>S</div>" +
              "<div class='C'>S</div>" +
            "</div>" +
            "<div class='"+this.markup.dayArea+"'>";

            html += "</div>" +
            "<div class='row nav'>" +
            "<i class='btn prev prev-year fa fa-fast-backward'></i>" +
            "<i class='btn prev prev-month fa fa-play fa-flip-horizontal'></i>" +
            "<i class='btn next next-month fa fa-play'></i>" +
            "<i class='btn next next-year fa fa-fast-forward'></i>" +
            "</div>" +
            "</div>" +
            "</div>";
            $(html).insertAfter(this.targetInput);
            $(this.targetInput).css('cursor','pointer');
            this.hide(0);
        }
        Cal.prototype.buildYearDOM = function() {
            html = "<div class='clear "+this.elementTag+"'>" +
              "<div class='view'>" +
              "<div class='head'>";

            for(var i=0; i < Object.keys(years).length; i++) {
              html+= "<div class='title year-title'><span class='yy'>" + years[i] + "</span></div>";
            }

            html+= "</div>";
            $(html).insertAfter(this.targetInput);
            $(this.targetInput).css('cursor','pointer');
            this.hide(0);
        }
        Cal.prototype.constructDayArea = function(flipDirection) {
            newViewContent = "";
            wd = this.wd(this.date.browse.getUTCDay());
            d = this.date.browse.getUTCDate();
            m = this.date.browse.getUTCMonth();
            y = this.date.browse.getUTCFullYear();

            monthBgnDate = new Date(y,m,1);
            monthBgn = monthBgnDate.getTime();
            monthEndDate = new Date(this.getMonthNext().getTime()-1000*60*60*24);
            monthEnd = monthEndDate.getTime();

            monthBgnWd = this.wd(monthBgnDate.getUTCDay());
            itrBgn = monthBgnDate.getTime()-(monthBgnWd-1)*1000*60*60*24;

            i = 1;
            n = 0;
            dayItr = itrBgn;
            newViewContent += "<div class='"+this.markup.row+"'>\n";
            while(n<35) {
                cls = new Array("C",this.markup.cell);
                if(dayItr<=monthBgn) cls.push(this.markup.inactive,"jump-to-previous-month");
                else if(dayItr>=monthEnd+1000*60*60*36) cls.push(this.markup.inactive,"jump-to-next-month");
                else cls.push(this.markup.currentMonth);
                if(dayItr==this.date.slctd.getTime()+1000*60*60*24) cls.push(this.markup.slctd);
                if(dayItr==this.date.today.getTime()+1000*60*60*24) cls.push(this.markup.today);

                date = new Date(dayItr);
                newViewContent += "<div class='"+cls.join(" ")+"'>"+date.getUTCDate()+"</div>\n";
                i += 1;
                if(i>7) {
                    i = 1;
                    newViewContent += "</div>\n<div class='"+this.markup.row+"'>\n";
                }
                n += 1;
                dayItr = dayItr+1000*60*60*24;
            }
            newViewContent += "</div>\n";


            this.changePage(newViewContent,flipDirection);
            $('.'+this.elementTag+' .title .m').html(monthNames[m]);
            $('.'+this.elementTag+' .title .y').html(y);
            return newViewContent;
        }
        Cal.prototype.constructYearArea = function(flipDirection) {
            newViewContent = "";
            wd = this.wd(this.date.browse.getUTCDay());
            d = this.date.browse.getUTCDate();
            m = this.date.browse.getUTCMonth();
            y = this.date.browse.getUTCFullYear();

            monthBgnDate = new Date(y,m,1);
            monthBgn = monthBgnDate.getTime();
            monthEndDate = new Date(this.getMonthNext().getTime()-1000*60*60*24);
            monthEnd = monthEndDate.getTime();

            monthBgnWd = this.wd(monthBgnDate.getUTCDay());
            itrBgn = monthBgnDate.getTime()-(monthBgnWd-1)*1000*60*60*24;

            i = 1;
            n = 0;
            dayItr = itrBgn;
            newViewContent += "<div class='"+this.markup.row+"'>\n";
            while(n<35) {
                cls = new Array("C",this.markup.cell);
                if(dayItr<=monthBgn) cls.push(this.markup.inactive,"jump-to-previous-month");
                else if(dayItr>=monthEnd+1000*60*60*36) cls.push(this.markup.inactive,"jump-to-next-month");
                else cls.push(this.markup.currentMonth);
                if(dayItr==this.date.slctd.getTime()+1000*60*60*24) cls.push(this.markup.slctd);
                if(dayItr==this.date.today.getTime()+1000*60*60*24) cls.push(this.markup.today);

                date = new Date(dayItr);
                newViewContent += "<div class='"+cls.join(" ")+"'>"+date.getUTCDate()+"</div>\n";
                i += 1;
                if(i>7) {
                    i = 1;
                    newViewContent += "</div>\n<div class='"+this.markup.row+"'>\n";
                }
                n += 1;
                dayItr = dayItr+1000*60*60*24;
            }
            newViewContent += "</div>\n";


            this.changePage(newViewContent,flipDirection);
            $('.'+this.elementTag+' .title .m').html(monthNames[m]);
            $('.'+this.elementTag+' .title .y').html(y);
            return newViewContent;
        }
        Cal.prototype.changePage = function(newPageContent,flipDirection) {

            multiplier = -1;
            mark = "-";
            if(flipDirection) {
                multiplier = 1;
                mark = "+";
            }

            oldPage = $('.'+this.elementTag+' .'+this.markup.dayArea+' .mArea');
            newPage = $("<div class='mArea'></div>").css('left',(-1*multiplier*224)+'px').html(newPageContent);
            $('.'+this.elementTag+' .'+this.markup.dayArea).append(newPage);

            $('.mArea').stop(1,1).animate({
                left: mark+"=224px"
            },300,function(){
                oldPage.remove();
            });
        }
        Cal.prototype.selectDate = function(y,m,d) {
            this.date.slctd = new Date(y,m,d);
            this.updateInput(y,m,d);
            this.constructDayArea(false);
            return this.date.slctd;
        }
        Cal.prototype.updateInput = function(y,m,d) {
            if(m=='') m = '';
            else m = monthNames[m];
            $(this.targetInput).val(y+" "+m+" "+d);
        }
        Cal.prototype.getMonthNext = function() {
            m = this.date.browse.getUTCMonth();
            y = this.date.browse.getUTCFullYear();
            if(m+1>11) return new Date(y+1,0);
            else return new Date(y,m+1);
        }
        Cal.prototype.getMonthPrev = function() {
            m = this.date.browse.getUTCMonth();
            y = this.date.browse.getUTCFullYear();
            if(m-1<0) return new Date(y-1,11);
            else return new Date(y,m-1);
        }
        Cal.prototype.setMonthNext = function() {
            m = this.date.browse.getUTCMonth();
            y = this.date.browse.getUTCFullYear();
            if(m+1>11) {
                this.date.browse.setUTCFullYear(y+1);
                this.date.browse.setUTCMonth(0);
            } else {
                this.date.browse.setUTCMonth(m+1);
            }
            this.constructDayArea(false);
        }
        Cal.prototype.setMonthPrev = function() {
            m = this.date.browse.getUTCMonth();
            y = this.date.browse.getUTCFullYear();
            if(m-1<0) {
                this.date.browse.setUTCFullYear(y-1);
                this.date.browse.setUTCMonth(11);
            } else {
                this.date.browse.setUTCMonth(m-1);
            }
            this.constructDayArea(true);
        }
        Cal.prototype.setYearNext = function() {
            y = this.date.browse.getUTCFullYear();
            this.date.browse.setUTCFullYear(y+1);
            this.constructDayArea(false);
        }
        Cal.prototype.setYearPrev = function() {
            y = this.date.browse.getUTCFullYear();
            this.date.browse.setUTCFullYear(y-1);
            this.constructDayArea(true);
        }
        Cal.prototype.hide = function(duration) {
            $('.'+this.elementTag+' .view').slideUp(duration);
        }
        Cal.prototype.show = function(duration) {
            t = this;
            t.init = true;
            $('.'+this.elementTag+' .view').slideDown(duration,function(){
                t.init = false;
            });
        }

        var c = new Cal();
        generateYearData(10);
