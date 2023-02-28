/* eslint-disable no-unused-vars */
import { EventService } from '@/services'

export default {
  namespaced: true,
  state: {
    event: {},
    participants: [],
    participant:{},
    events: [],
    requests: [],
    request: {},
    documents:[],
    eventHome:{},
    collaborationList: [],

    linkCheckIn: "",

    invitations:[],

    notis:[],
    eventConfig: {},

    listEventConfig:[],
    eventReports :[]
   
  },
  mutations: {
    setEvent: (state, event) => (state.event = event),
    setParticipant: (state, participant) => (state.participant = participant),
    setParticipants: (state, participants) => (state.participants = participants),
    setEvents: (state, events) => (state.events = events),
    setEventReports: (state, eventReports) => (state.eventReports = eventReports),
    setRequests: (state, requests) => (state.requests = requests),
    setRequest: (state, request) => (state.request = request),
    setDocuments: (state, documents) => (state.documents = documents),
    setEventHome: (state,eventHome) => ( state.eventHome = eventHome),

    setInvitations: (state,invitations) => ( state.invitations = invitations),

    setLinkCheckin: (state,linkCheckIn) => (state.linkCheckIn = linkCheckIn),

    setCollaborationList:(state, collaborationList) =>  ( state.collaborationList = collaborationList),
    setNotis:(state,notis) => (state.notis = notis),


    setEventConfig:(state, eventConfig) => (state.eventConfig = eventConfig),
    setListEventConfig:(state,listEventConfig) => (state.listEventConfig = listEventConfig),
  },
  actions: {
    async getEventReport({commit},payload){
      const response = await EventService.getEventReport(payload)
      commit('setEvents', response.data)
      return response.data
    },

    async getEventReportPaging({commit},payload){
      const response = await EventService.getEventReportPaging(payload)
      commit('setEventReports', response.data)
      
      return response.data
    },

    async exportEventsReport({commit},payload){
      const response = await EventService.exportEventsReport(payload)
      return response.data
    },

    async getEventConfig({commit}){
      const response = await EventService.getEventConfig()
      commit('setEventConfig', response.data)
      return response.data
    },
    async getEventConfigAuto({commit}){
      const response = await EventService.getEventConfigAuto()
      commit('setEventConfig', response.data)
      return response.data
    },

    async getListEventConfig({commit} ,payload){
      const response = await EventService.getListEventConfig(payload)
      commit('setListEventConfig', response.data)
      return response.data
    },

    async createEventConfig({commit} ,payload){
      const response = await EventService.createEventConfig(payload)
      commit('setEventConfig', response.data)
      return response.data
    },

    async updateEventConfig({commit} ,payload){
      const response = await EventService.updateEventConfig(payload)
      commit('setEventConfig', response.data)
      return response.data
    },

    async getAllEventHome({ commit }) {
      const response = await EventService.getAllEventHome()
      commit('setEventHome', response.data)
      return response.data
    },

    async getAllEvent({ commit }, payload) {
      const response = await EventService.getAllEvent(payload)
      commit('setEvents', response.data)
      return response.data
    },
    async getMyEvent({ commit }, payload) {
      const response = await EventService.getMyEvent(payload)
      commit('setEvents', response.data)
      return response.data
    },
    async getEventDetail({ commit }, payload) {
      const response = await EventService.getEventDetail(payload)
      commit('setEvent', response.data)
      commit('setDocuments', response.data.documents)
      const collaborationList = response.data.organizationCommittees.filter((item) => {
        return item?.role?.id === "ROLE_COLLABORATOR";
      });
      commit('setCollaborationList' ,collaborationList)

      return response.data
    },
    async createEvent({ commit }, formData) {
      const response = await EventService.createEvent(formData)

      return response.data
    },
    async updateEvent({ commit }, formData) {
      const response = await EventService.updateEvent(formData)
      commit('setEvent', response.data)

      return response.data
    },
    async deleteEvent({ commit }, payload) {
      const response = await EventService.deleteEvent(payload)

      return response.data
    },
    async deleteParticipant({ commit }, payload) {
      const response = await EventService.deleteParticipant(payload)
      commit('setParticipant', response.data)

      return response.data
    },
    async getAllJoinEventRequest({ commit }, payload) {
      const response = await EventService.getAllJoinEventRequest(payload)
      commit('setRequests', response.data)

      return response.data
    },
    async acceptOrRejectJoinEventRequest({ commit }, payload) {
      const response = await EventService.acceptOrRejectJoinEventRequest(payload)
      commit('setRequest', response.data)

      return response.data
    },
    async approveEvent({ commit }, payload) {
      
      const response = await EventService.approveEvent(payload)
      commit('setRequest', response.data)
      return response.data
    },
    async rejectEvent({ commit }, payload) {
      const response = await EventService.rejectEvent(payload)
      commit('setRequest', response.data)
      return response.data
    },
    async stopEvent({ commit }, payload) {
      const response = await EventService.stopEvent(payload)
      commit('setRequest', response.data)
      return response.data
    },

    async startEvent({commit}, payload){
      const response = await EventService.startEvent(payload)
      
      return response.data
    },
    async endEvent({commit}, payload){
      const response = await EventService.endEvent(payload)
      return response.data
    },
    async updateBanner({commit}, payload){
      const response = await EventService.updateBanner(payload)
      return response.data
    },

    //document
    async updateDocument({commit}, payload){
      const response = await EventService.updateDocument(payload)
      return response.data
    },
    async deleteDocument({commit}, payload){
      const response = await EventService.deleteDocument(payload)
      return response.data
    },

    //pariticipant
    async filterEventParticipant({commit}, payload){
      const response = await EventService.filterEventParticipant(payload)
      commit('setParticipants', response.data)
      return response.data
    },
    async rejectParticipation({commit}, payload){
      const response = await EventService.rejectParticipation(payload)
      commit('setParticipant', response.data)
      return response.data
    },
    async approveParticipation({commit}, payload){
      const response = await EventService.approveParticipation(payload)
      commit('setParticipant', response.data)
      return response.data
    },
    async registerParticipation({commit}, payload){
      const response = await EventService.registerParticipation(payload)
      commit('setParticipant', response.data)
      return response.data
    },
    async cancelParticipation({commit}, payload){
      const response = await EventService.cancelParticipation(payload)
      commit('setParticipant', response.data)
      return response.data
    },

    //feedback
    async updateFeedback({commit}, payload){
      const response = await EventService.updateFeedback(payload)
      return response.data
    },

     //collaboration
     async sendCollaboration({commit}, payload){
      const response = await EventService.sendCollaboration(payload)
      return response.data
    },
    async cancelCollaboration({commit}, payload){
      const response = await EventService.cancelCollaboration(payload)
      return response.data
    },
    async deleteCollaboration({commit}, payload){
      const response = await EventService.deleteCollaboration(payload)
      return response.data
    },
    async acceptCollaboration({commit}, payload){
      const response = await EventService.acceptCollaboration(payload)
      return response.data
    },
    async rejectCollaboration({commit}, payload){
      const response = await EventService.rejectCollaboration(payload)
      return response.data
    },

    //update-event-room
    async updateEventRoom({commit}, payload){
      const response = await EventService.updateEventRoom(payload)
      return response.data
    },

    //get my event 
    async getOzganizeEvent({ commit }, payload) {
      const response = await EventService.getOzganizeEvent(payload)
      commit('setEvents', response.data)
      return response.data
    },
    async getCollaborationEvent({ commit }, payload) {
      const response = await EventService.getCollaborationEvent(payload)
      commit('setEvents', response.data)
      return response.data
    },
    async getPaticipantEvent({ commit }, payload) {
      const response = await EventService.getPaticipantEvent(payload)
      commit('setEvents', response.data)
      return response.data
    },

    async getAllInvitations({ commit }, payload) {
      const response = await EventService.getAllInvitations(payload)
      commit('setInvitations', response.data)
      return response.data
    },

    async getAllRequests({ commit }, payload) {
      const response = await EventService.getAllRequests(payload)
      commit('setEvents', response.data)
      return response.data
    },

    async getAllNoti({ commit }, payload) {
      const response = await EventService.getAllNoti(payload)
      commit('setNotis', response.data)
      return response.data
    },

    async deleteNoti({ commit }, payload) {
      const response = await EventService.deleteNoti(payload)
      return response.data
    },

    async reportRequest({ commit }, payload) {
      const response = await EventService.reportRequest(payload)
      return response.data
    },


  }
}
