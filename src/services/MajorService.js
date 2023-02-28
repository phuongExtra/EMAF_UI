import RestAPI from '@/config/rest'

const MajorService = {
  async getAllMajor() {
    return await RestAPI.get('/major/all', {}, {}, true)
  },
}

export default MajorService
