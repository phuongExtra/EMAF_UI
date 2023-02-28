import RestAPI from '@/config/rest'

const RoomService = {
  async getAllRoom(payload) {
    return await RestAPI.get('/room/all', payload, {}, true)
  },
  async getAllRoomAvailable(payload) {
    return await RestAPI.get('/room/all-available', payload, {}, true)
  },

  async getRoomSchedule(payload) {
    return await RestAPI.get('/room/event-room-by-date', payload, {}, true)
  },
 
}

export default RoomService
