'use strict'

class Radar {
  constructor (data) {
    this.protocols = data.protocols
    this.zones = data.scan
    this.targets = []

    this.defineTargets()
    this.targetSelection()
    this.targetPriority()
  }

  defineTargets () {
    this.zones.forEach(zone => {
      const target = {
        priority: 0,
        distance: this.calcDestance({ x: 0, y: 0 }, zone.coordinates),
        coordinates: zone.coordinates,
        enemies: zone.enemies,
        allies: zone.allies
      }

      this.targets.push(target)
    })
  }

  calcDestance (startpoint, endpoint) {
    const a = endpoint.x - startpoint.x
    const b = endpoint.y - startpoint.y

    return Math.hypot(a, b)
  }

  targetSelection () {
    this.targets = this.targets.filter((target) => {
      return target.distance <= 100
    })

    this.targets = this.targets.filter((target) => {
      return target.enemies.number >= 1
    })

    if (this.protocols.includes('avoid-mech')) {
      this.targets = this.targets.filter((target) => {
        return target.enemies.type !== 'mech'
      })
    }

    if (this.protocols.includes('avoid-crossfire')) {
      this.targets = this.targets.filter((target) => {
        return target.allies === undefined
      })
    }
  }

  targetPriority () {
    if (this.protocols.includes('prioritize-mech')) {
      this.targets.forEach((target) => {
        if (target.enemies.type === 'mech') { target.priority++ }
      })
    }

    if (this.protocols.includes('assist-allies')) {
      this.targets.forEach((target) => {
        if (target.allies !== undefined) { target.priority++ }
      })
    }

    if (this.protocols.includes('closest-enemies')) {
      this.targets.sort((a, b) => (a.distance > b.distance) ? 1 : -1)
    }

    if (this.protocols.includes('furthest-enemies')) {
      this.targets.sort((a, b) => (a.distance < b.distance) ? 1 : -1)
    }

    this.targets.sort((a, b) => (a.priority <= b.priority) ? 1 : -1)
  }
}

module.exports = Radar
