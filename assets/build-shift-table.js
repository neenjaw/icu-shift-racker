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
function buildShiftTable(shiftDataJSON, shiftHeadClasses = '', shiftCellClasses = '', locale = 'en-us') {

 /*
  * Builds a date 'td' cell -- eg: <td data-shift-date="yyyy-mm-dd" data-shift-id="1" data-shift-code="X">X</td>
  */
  function buildShiftCell(doc, shift) {
    var c = doc.createElement("td");
    c.dataset.shiftDate = shift.shift_date;
    c.dataset.shiftId = shift.shift_id;
    c.dataset.shiftCode = shift.shift_code;

    c.innerHTML = shift.shift_code;

    return c;
  }

 /*
  * Builds a name 'th' cell -- eg: <th data-staff-name="Jones, Tom" data-staff-id="1">Jones, Tom</th>
  */
  function buildNameHeadCell(doc, staff) {
    var c = doc.createElement("td");
    c.dataset.staffName = staff.name;
    c.dataset.staffId = staff.id;

    c.innerHTML = staff.name;

    return c;
  }

 /*
  * Builds a month 'th' cell -- eg: <th data-shift-date="yyyy-mm-dd">Jan</th>
  * If the month is a new month from the last one, print the name, otherwise print &nsbp;
  */
  function buildMonthHeadCell(doc, date, mString) {
    var c = doc.createElement("th");
    c.dataset.shiftDate = shift.shift_date;

    c.innerHTML = mString;

    return c;
  }

 /*
  * Custom comparitor for the date based on year and month
  */
  function isNewMonth(date, lastDate) {

    if ( date.getYear() > lastDate.getYear() ) {
      return true;
    } else if ( (date.getYear() == lastDate.getYear()) && (date.getMonth() > lastDate.getMonth()) ) {
      return true;
    } else {
      return false;
    }

  }

 /*
  * Builds a date 'th' cell -- eg: <th data-shift-date="yyyy-mm-dd">dd</th>
  */
  function buildDateHeadCell(doc, date) {
    var c = doc.createElement("th");
    c.dataset.shiftDate = shift.shift_date;

    c.innerHTML = date.getDate();

    return c;
  }

 /*
  * Builds an empty 'th' cell -- eg: <th>&nsbp;</th>
  */
  function buildEmptyHeadCell(doc) {
    var c = doc.createElement("th");

    c.innerHTML = "&nbsp";

    return c;
  }

 /*
  *
  *
  *
  */
  var doc = document;
  var shiftTable = doc.createElement("table");

  var headMonthRow = doc.createElement("tr");
  headMonthRow.appendChild(buildEmptyHeadCell(doc));

  var headDateRow = doc.createElement("tr");
  headDateRow.appendChild(buildEmptyHeadCell(doc));

  var rowFragment = doc.createDocumentFragment();
  var tempRow = null;
  var monthString = '&nbsp';

  var firstLoop = true;
  var lastDate = new Date("0001-01-01");

  //for each loop through each of the staff entry of the JSON

  for (var staff in shiftDataJSON) {
      // skip loop if the property is from prototype
      if (!shiftDataJSON.hasOwnProperty(staff)) continue;
      console.log(staff);
      tempRow = doc.createElement("tr");

      tempRow.appendChild(buildNameHeadCell(doc, shiftDataJSON.staff[staff]));


      //create each row for the table, with dynamic links as neccessary where char != '-'
          //in the first iteration, create the header rows
      for (var shift in shiftDataJSON.staff[staff].shifts) {
        // skip loop if the property is from prototype
        if (!shiftDataJSON[staff].shifts.hasOwnProperty(shift)) continue;

        var shiftId = shiftDataJSON.staff[staff].shifts[shift].shift_id;
        var shiftDate = new Date(shiftDataJSON.staff[staff].shifts[shift].shift_date);
        var shiftCode = shiftDataJSON.staff[staff].shifts[shift].shift_code;

        if (firstLoop) {
          if (isNewMonth(shiftDate, lastDate)) {
            monthString = date.toLocaleString(locale, { month: "short" });
          } else {
            monthString = '&nbsp;';
          }

          headMonthRow.appendChild(buildMonthHeadCell(doc, shiftDate, monthString));
          headDateRow.appendChild(buildDateHeadCell(doc, shiftDate));
        }

        tempRow.appendChild(buildShiftCell(doc, shiftDataJSON.staff[staff].shifts[shift]));
      }

      //append it to the fragment
      rowFragment.appendChild(tempRow);

      firstLoop = false;
  }
  //end loop

  //append the rows to the table dom object
  shiftTable.appendChild(headMonthRow);
  shiftTable.appendChild(headDateRow);
  shiftTable.appendChild(rowFragment);

  //return the completed table to caller so can be appended to dom at correct place.
  return shiftTable;
}
