import RestAPI from '@/config/rest'

const EventService = {
  async getEventReport(payload) {
    return await RestAPI.get('/event/get-chart-data', payload, {}, true)
  },

  async getEventReportPaging(payload) {
    return await RestAPI.get('/event/get-event-report', payload, {}, true)
  },

  async exportEventsReport(payload) {
    return await RestAPI.get('/report/export-list', payload, {}, true)
  },

  async getAllEventHome() {
    return await RestAPI.get('/event/events-dashboard', {}, {}, true)
  },

  async getAllEvent(payload) {
    return await RestAPI.get('/event/all/filter', payload, {}, true)
  },
  async getMyEvent(payload) {
    return await RestAPI.get('/event/my-events', payload, {}, true)
  },
  async getEventDetail(payload) {
    return await RestAPI.get(`/event/event-detail?id=${payload}`, {}, {}, true)
  },
  async updateEvent(formData) {
    return await RestAPI.post('/event/update', formData, {}, true)
  },
  async createEvent(formData) {
    return await RestAPI.post('/event/create', formData, {}, true)
  },
  async deleteEvent(payload) {
    return await RestAPI.post(`/event/delete?eventId=${payload}`, {}, {}, true)
  },
  async startEvent(payload) {
  
    return await RestAPI.get(`/event/start-event?eventId=${payload}`,{}, {}, true)
  },
  async endEvent(payload) {
    return await RestAPI.get(`/event/end-event?eventId=${payload}`,{}, {}, true)
  },

  async checkin(payload) {
    return await RestAPI.get(`/event/checkin`, payload, {}, true)
  },
  async checkout(payload) {
    return await RestAPI.get(`/event/checkout`, payload, {}, true)
  },
  async approveEvent(payload) {
    return await RestAPI.post(`/event/approve?eventId=${payload}`, {}, {}, true)
  },
  async stopEvent(payload) {
    return await RestAPI.post(`/event/stop-event`, payload, {}, true)
  },
  async rejectEvent(payload) {
    return await RestAPI.post(`/event/reject`, payload, {}, true)
  },
  async updateBanner(payload) {
    return await RestAPI.upload(`/event/update-banner?eventId=${payload.eventId}`, payload.banner, {}, true)
  },

  //document
  async updateDocument(payload) {
    return await RestAPI.upload(`/event/upload-document`, payload, {}, true)
  },
  async deleteDocument(payload) {
    return await RestAPI.get(`/event/delete-document?documentId=${payload}`,{}, {}, true)
  },

  //request
  async filterEventParticipant(payload){
    return await RestAPI.get('/event/filterEventParticipant' ,payload,{},{},true)
  },
  async rejectParticipation(payload){
    return await RestAPI.get(`/event/reject-participation?eventParticipantId=${payload}` ,{},{},true)
  },
  async approveParticipation(payload){
    return await RestAPI.get(`/event/approve-participation?eventParticipantId=${payload}` ,{},{},true)
  },
  async registerParticipation(payload){
    return await RestAPI.get(`/event/register-participation?eventId=${payload}`,{},{},true)
  },
  async cancelParticipation(payload){
    return await RestAPI.get(`/event/cancel-participation?eventParticipantId=${payload}`,{},{},true)
  },

  //feedback
  async updateFeedback(payload){
    return await RestAPI.get(`/event/update-feedback`,payload,{},true)
  },

  //collaboration
  async sendCollaboration(payload){
    return await RestAPI.post(`/event/send-collaboration`,payload,{},true)
  },
  async cancelCollaboration(payload){
    return await RestAPI.get(`/event/cancel-collaboration?userEventRoleId=${payload}`,{},{},true)
  },
  async deleteCollaboration(payload){
    return await RestAPI.get(`/event/delete-collaboration?userEventRoleId=${payload}`,{},{},true)
  },
  async rejectCollaboration(payload){
    return await RestAPI.get(`/event/reject-collaboration?userEventRoleId=${payload}`,{},{},true)
  },
  async acceptCollaboration(payload){
    return await RestAPI.get(`/event/accept-collaboration?userEventRoleId=${payload}`,{},{},true)
  },

  async updateEventRoom(payload){
    return await RestAPI.post(`/event/update-event-room`,payload,{},true)
  },

  //getmyEvent

  async getOzganizeEvent(payload) {
    return await RestAPI.get('/event/organized-events', payload, {}, true)
  },
  async getCollaborationEvent(payload) {
    return await RestAPI.get('/event/collaborating-events', payload, {}, true)
  },
  async getPaticipantEvent(payload) {
    return await RestAPI.get('/event/participating-events', payload, {}, true)
  },


  //invitation and request

  async getAllInvitations() {
    return await RestAPI.get(`/collaboration/invitations`,{}, {}, true)
  },

  async getAllRequests() {
    return await RestAPI.get(`/participation/requests`,{}, {}, true)
  },

  async getAllNoti(){
    return await RestAPI.get(`/notification/all`,{},{},true)
  },

  async deleteNoti(payload){
    return await RestAPI.get(`/notification/delete?notificationId=${payload}`,{},{},true)
  } ,

  async reportRequest(payload){
    return await RestAPI.get(`/report/export?eventId=${payload}`,{},{},true)
  },

  //config event
  async getEventConfig() {
    return await RestAPI.get(`/event-configuration/get-configs`,{}, {}, true)
  },

  async getEventConfigAuto() {
    return await RestAPI.get(`/event-configuration/get-config`,{}, {}, true)
  },

  async getListEventConfig(payload) {
    return await RestAPI.get(`/event-configuration/all`,payload, {}, true)
  },

  async createEventConfig(payload) {
    return await RestAPI.post(`/event-configuration/create-config`,payload, {}, true)
  },

  async updateEventConfig(payload) {
    return await RestAPI.post(`/event-configuration/update-config`,payload, {}, true)
  },
}

export default EventService
