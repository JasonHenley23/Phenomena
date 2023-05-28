// Build an apiRouter using express Router
const { Router } = require('express');
const express = require('express');
const apiRouter = express.Router();
const { getOpenReports, closeReport, createReport, createReportComment } =require ('../db');

apiRouter.get('/reports', async (req,res,next)=>{
    try {
        const reports = await getOpenReports();
        res.send({reports});
    }
    catch(error) {
       next(error) 
    }
})

// Import the database adapter functions from the db

apiRouter.post('/reports', async (req, res, next)=>{
    try {
        const posts = await createReport(req.body);
        res.send(posts);
    }
    catch(error) {
        next(error)
    }
})



/**
 * Set up a POST request for /reports
 * 
 * - it should use an async function
 * - it should await a call to createReport, passing in the fields from req.body
 * - on success, it should send back the object returned by createReport
 * - on caught error, call next(error)
 */

apiRouter.delete('/reports/:reportId', async (req, res, next)=>{
    try {
        const deleteReport = await closeReport(req.params.reportId, req.body.password);
        res.send(deleteReport);
    }
    catch(error) {
        next(error)
    }
})

/**
 * Set up a DELETE request for /reports/:reportId
 * 
 * - it should use an async function
 * - it should await a call to closeReport, passing in the reportId from req.params
 *   and the password from req.body
 * - on success, it should send back the object returned by closeReport
 * - on caught error, call next(error)
 */

apiRouter.post('/reports/:reportId/comments', async (req, res, next)=>{
    try {
        const postReport = await createReportComment(req.params.reportId, req.body);
        res.send(postReport);
    }
    catch(error) {
        next(error)
    }
})

/**
 * Set up a POST request for /reports/:reportId/comments
 * 
 * - it should use an async function
 * - it should await a call to createReportComment, passing in the reportId and
 *   the fields from req.body
 * - on success, it should send back the object returned by createReportComment
 * - on caught error, call next(error)
 */



// Export the apiRouter

module.exports = apiRouter