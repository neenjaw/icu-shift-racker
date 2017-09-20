/*
 * This is a specialized function to create a table element for the ICU Shift Tracker web app
 * Assumptions:
 *    1. Bootstrap is the front-end style library in use.
 *    2. $dataArray is in the format specified as a JSON object:
 *
 *    {
 *          staff: {
 *              name : "Name",
 *              id : int,
 *              shifts: [
 *                  {shift_date: "yyyy-mm-dd", shift_id: int, shift_code: char(1)},
 *                  {shift_date: "yyyy-mm-dd", shift_id: int, shift_code: char(1)},
 *                  ...
 *              ]
 *          },
 *          staff: {
 *              name : "Name",
 *              id : int,
 *              shifts: [
 *                  {shift_date: "yyyy-mm-dd", shift_id: int, shift_code: char(1)},
 *                  {shift_date: "yyyy-mm-dd", shift_id: int, shift_code: char(1)},
 *                  ...
 *              ]
 *          }
 *    }
 *
 * Output:
 *
 *        |Jul                          |Aug
 *        |1    |2    |3    |4    |5    |1    |2    |3    |4    |
 * name 1 |  -  |  C  |  C  |  C  |  C  |  -  |  -  |  -  |  -  |
 * name 2 |  -  |  -  |  -  |  V  |  V  |  -  |  -  |  -  |  -  |
 * name 3 |  -  |  -  |  S  |  S  |  S  |  -  |  -  |  -  |  O  |
 *
 */
function buildShiftTable(staffObj, tableClasses = '', theadClasses = '', tbodyClasses = '', dateHeadClasses = '', rowHeadClasses = '', cellClasses = '', locale = 'en-us') {

 /*
  * Builds a date 'td' cell -- eg: <td data-shift-date="yyyy-mm-dd" data-shift-id="1" data-shift-code="X">X</td>
  */
  function buildShiftCell(doc, shift, cellClass = '') {
    var c = doc.createElement("td");
    c.dataset.shiftDate = shift.date;
    c.dataset.shiftId = shift.id;
    c.dataset.shiftCode = shift.code;
    c.setAttribute("class", cellClass);

    if (shift.code != '-') {
      var a = doc.createElement("a");
      a.innerHTML = shift.code;
      a.setAttribute("href", "javascript:void(0)");

      c.appendChild(a);
    } else {
      c.innerHTML = shift.code;
    }

    return c;
  }

 /*
  * Builds a name 'th' cell -- eg: <th data-staff-name="Jones, Tom" data-staff-id="1">Jones, Tom</th>
  */
  function buildNameHeadCell(doc, staff, headClass = '') {
    var c = doc.createElement("td");
    c.dataset.staffName = staff.name;
    c.dataset.staffId = staff.id;
    c.setAttribute("class", headClass);

    c.innerHTML = '<pre>'+staff.name+'</pre>';

    return c;
  }

 /*
  * Builds a month 'th' cell -- eg: <th data-shift-date="yyyy-mm-dd">Jan</th>
  * If the month is a new month from the last one, print the name, otherwise print &nsbp;
  */
  function buildMonthHeadCell(doc, date, mString, headClass = '') {
    var c = doc.createElement("th");
    c.dataset.shiftDate = toYYYYMMDD(date);
    c.setAttribute("class", headClass);

    c.innerHTML = mString;

    return c;
  }

 /*
  * Custom comparitor for the date based on year and month
  */
  function isNewMonth(date, lastDate) {

    if ( date.getUTCFullYear() > lastDate.getUTCFullYear() ) {
      return true;
    } else if ( (date.getUTCFullYear() == lastDate.getUTCFullYear()) && (date.getUTCMonth() > lastDate.getUTCMonth()) ) {
      return true;
    } else {
      return false;
    }

  }

 /*
  * Builds a date 'th' cell -- eg: <th data-shift-date="yyyy-mm-dd">dd</th>
  */
  function buildDateHeadCell(doc, date, headClass) {
    var c = doc.createElement("th");
    c.dataset.shiftDate = toYYYYMMDD(date);
    c.setAttribute("class", headClass);

    c.innerHTML = date.getUTCDate();

    return c;
  }

 /*
  * Builds an UTCempty 'th' cell -- eg: <th>&nsbp;</th>
  */
  function buildEmptyHeadCell(doc, headClass, optionalCaption = '&nbsp;') {
    var c = doc.createElement("th");
    c.setAttribute("class", headClass);

    c.innerHTML = optionalCaption;

    return c;
  }


 /*
  * returns ISO format for date
  */
  function toYYYYMMDD(date) {
    return date.toISOString().substring(0,10);
  }

 /*
  * main function
  *
  * -builds the table with an iterative nested loop.
  * -outer loop for each row
  * -inner loop is for each cell
  */
  var doc = document;
  var shiftTable = doc.createElement("table");
  shiftTable.setAttribute("class", tableClasses);

  var headMonthRow = doc.createElement("tr");
  headMonthRow.appendChild(buildEmptyHeadCell(doc, dateHeadClasses));

  var headDateRow = doc.createElement("tr");
  headDateRow.appendChild(buildEmptyHeadCell(doc, dateHeadClasses, "Date"));

  var rowFragment = doc.createDocumentFragment();
  var tempRow = null;
  var monthString = '&nbsp';

  var firstLoop = true;
  var lastDate = new Date("0001-01-01");

  //for each loop through each of the staff entry of the Object
  if (!staffObj.hasOwnProperty('staff')) throw 'Object not formatted properly';

  for (var staff in staffObj.staff) {
      //console.log(staffObj.staff[staff]);
      tempRow = doc.createElement("tr");

      tempRow.appendChild(buildNameHeadCell(doc, staffObj.staff[staff], rowHeadClasses));


      //create each row for the table, with dynamic links as neccessary where char != '-'
      for (var shift in staffObj.staff[staff].shifts) {

        var shiftId = staffObj.staff[staff].shifts[shift].id;
        var shiftDate = new Date(staffObj.staff[staff].shifts[shift].date);
        var shiftCode = staffObj.staff[staff].shifts[shift].code;

        //in the first iteration, create the header rows;
        if (firstLoop) {
          if (isNewMonth(shiftDate, lastDate)) {
            monthString = shiftDate.toLocaleString(locale, { month: "short", timeZone: 'UTC' });
          } else {
            monthString = '&nbsp;';
          }
          lastDate = shiftDate;

          headMonthRow.appendChild(buildMonthHeadCell(doc, shiftDate, monthString, dateHeadClasses));
          headDateRow.appendChild(buildDateHeadCell(doc, shiftDate, dateHeadClasses));
        }

        tempRow.appendChild(buildShiftCell(doc, staffObj.staff[staff].shifts[shift], cellClasses));
      }

      //append it to the fragment
      rowFragment.appendChild(tempRow);

      firstLoop = false;
  }
  //end loop

  //append the rows to the table dom object
  var thead = doc.createElement("thead");
  thead.appendChild(headMonthRow);
  thead.appendChild(headDateRow);
  thead.setAttribute("class", theadClasses);

  shiftTable.appendChild(thead);

  var tbody = doc.createElement("tbody");
  tbody.appendChild(rowFragment);
  tbody.setAttribute("class", tbodyClasses);

  shiftTable.appendChild(tbody);

  //return the completed table to caller so can be appended to dom at correct place.
  return shiftTable;
}