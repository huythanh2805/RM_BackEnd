import Location from "../models/location.js"
import Table from "../models/table.js"
class LocationController {
  async getAllLocation(req, res) {
    try {
        const locations = (await Location
          .find({})
          .sort({ order: 1 }))
        const orderNumberLocationMax = (await Location
          .findOne()
          .sort({ order: -1 })) 
        let numberOfLocation
        orderNumberLocationMax
          ? (numberOfLocation = orderNumberLocationMax.order + 1)
          : (numberOfLocation = 1)
        return res.status(201).json({ locations, numberOfLocation },)
      } catch (error) {
        console.log("Inventories_Error", error)
        return res.status(500).json(
          { message: "Internal Server Error" },
        )
      }
  }

  addNewLocation = async (req, res) => {
    try {
      const { numberOfLocation } = req.body
      if (!numberOfLocation)
        return res.status(401).json({ message: "All data are required" })
      const newlocation = await Location.create({ order: numberOfLocation })
      return res.status(201).json({ newlocation, message: "Succussfully!" })
    } catch (error) {
      console.log("Inventories_Error", error)
      return res.status(500).json({ message: "Internal Server Error" })
    }
  }
  // Update order location
  updateForNewLocation = async (item, index) => {
    await Location.findByIdAndUpdate({ _id: item._id }, { order: index })
  }

  updateLocationOrder = async (req, res) => {
    const { newArray } = req.body
    await connectToDB()
    const LocationArray = newArray
    if (!newArray)
      return res.status(401).json(
        { message: "Array for update is currently empty" },
      )
    try {
      LocationArray.forEach((item, index) => {
        updateForNewLocation(item, index)
      })
      return res.status(201).json({ message: "Successfully" })
    } catch (error) {
      console.log(error)
    }
  }

  // update information
  async updateLocationInformation(req, res) {
    const { id } = req.params.id
    const { locationInRestaurant } = req.body
    if (!id) return res.status(401).json({ message: "There's no id" })
    if (!locationInRestaurant)
      return res
        .status(401)
        .json({ message: "There is no body to update location" })

    try {
      const newLocation = await Location.findByIdAndUpdate(
        { _id: id },
        { locationInRestaurant: locationInRestaurant }
      )
      return res
        .status(201)
        .json({ message: "Update Successfully!", newLocation })
    } catch (error) {
      console.log("Inventories_Error", error)
      return res.status(500).json({ message: "Internal Server Error" })
    }
  }
  // Delete location
  async deleteLocation(req, res) {
    const { id } = req.params.id
    if (!id)
      return res
        .status(401)
        .json({ message: "There is no Id to delete location!" })

    try {
      await Table.deleteMany({ location_id: id })
      await Location.findByIdAndDelete({ _id: id })
      return res.status(201).json({ message: "Delete Successfully!" })
    } catch (error) {
      console.log("Inventories_Error", error)
      return res.status(500).json({ message: "Internal Server Error" })
    }
  }
}

export default LocationController
