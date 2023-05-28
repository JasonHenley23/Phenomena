
const { Client } = require('pg')
const CONNECTION_STRING = process.env.DATABASE_URL || 'postgres://localhost:5432/phenomenadev';
const client = new Client(CONNECTION_STRING);




async function getOpenReports() {
  try {
    const { rows: reports } = await client.query(`
    SELECT * 
    FROM reports
    WHERE "isOpen" = true`);

    const { rows: comments } = await client.query(`
    SELECT * 
    FROM comments
    WHERE "reportId" IN (${reports.map(report => report.id).join(",")})
    `);

    for (const report of reports) {
      report.comments = comments.filter(comment => comment.reportId === report.id)
      report.isExpired = Date.parse(report.expirationDate) < new Date()
      delete report.password 
    }
    

    return reports;

  } catch (error) {
    throw error;
  }
}


async function createReport({
  title,
  location,
  description,
  password
}) {
  try {
    const { rows: reports } = await client.query(`
      INSERT INTO reports(title, location, description, password) 
      VALUES($1, $2, $3, $4)
      RETURNING *;
    `, [title, location, description, password]);
    delete reports[0].password
   

    return reports[0];
  } catch (error) {
    throw error;
  }
}

async function _getReport(reportId) {
  try {
    const { rows: reports } = await client.query(`
    SELECT *
    FROM reports
    WHERE id=$1;
    `, [reportId])
  
    // return the report
    return reports[0];

  } catch (error) {
    throw error;
  }
}


async function closeReport(reportId, password) {
  try {
    const { rows: [report] } = await client.query(`
    SELECT * 
    FROM reports 
    WHERE id=$1
    `, [reportId])


    if (!report) {
      throw Error ('Report does not exist with that id')
    }
    if (password != report.password) {
      throw Error ('Password incorrect for this report, please try again')
    }
    if (!report.isOpen) {
      throw Error ('This report has already been closed')
    }

    await client.query(`
    UPDATE reports
    SET "isOpen" = false
    WHERE id=$1
    `, [reportId]);
    
    return {"message": "Report successfully closed!"};

  } catch (error) {
    throw error;

  }
}
/**
 * If the report is not found, or is closed or expired, throw an error
 * 
 * Otherwise, create a new comment with the correct
 * reportId, and update the expirationDate of the original
 * report to CURRENT_TIMESTAMP + interval '1 day' 
 */
async function createReportComment(reportId, commentFields) {
  // read off the content from the commentFields


  try {
    const { rows: [report] } = await client.query(`
      SELECT *
      FROM reports
      WHERE id=$1
    `, [reportId])

    if (!report) {
      throw Error ('That report does not exist, no comment has been made')
    }
    if (Date.parse(report.expirationDate) < new Date()) {
      throw Error ('The discussion time on this report has expired, no comment has been made')
    }
    if (!report.isOpen) {
      throw Error ('That report has been closed, no comment has been made')
    }

    const { rows: [comment] } = await client.query(`
    INSERT INTO comments("reportId", content)
    VALUES ($1, $2)
    RETURNING *;
    `, [reportId, commentFields.content] )

    await client.query(`
    UPDATE reports
    SET "expirationDate" = CURRENT_TIMESTAMP + interval '1 day'
    WHERE id=$1
    `, [reportId]);

    
    // grab the report we are going to be commenting on


    // if it wasn't found, throw an error saying so
    

    // if it is not open, throw an error saying so
    

    // if the current date is past the expiration, throw an error saying so
    // you can use Date.parse(report.expirationDate) < new Date() to check
    

    // all go: insert a comment
    

    // then update the expiration date to a day from now
    

    // finally, return the comment
    
    return comment;

  } catch (error) {
    throw error;
  }
}


module.exports = {
  getOpenReports,
  createReport,
  _getReport,
  closeReport,
createReportComment,
client
}