import Reservation from 'App/Models/Reservation'

type MonthlyTotal = { month: number; completedReservations: number }

export default class CourtUsageStatsService {
  public async getCourtUsageTotal(userId: number): Promise<number> {
    const reservations = await Reservation.query()
      .where('user_id', userId)
      .andWhere('status', 'COMPLETED')

    const count = reservations.length

    return count
  }

  public async getCourtUsageByMonth(userId: number): Promise<MonthlyTotal[]> {
    const acceptedReservations = await Reservation.query()
      .select('start_time')
      .where('user_id', userId)
      .andWhere('status', 'COMPLETED')

    const monthlyTotals: MonthlyTotal[] = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      completedReservations: 0,
    }))

    acceptedReservations.forEach((reservation: Reservation) => {
      const startTime = new Date(reservation.startTime.toString())
      const month = startTime.getMonth() + 1

      const monthIndex = month - 1
      if (monthIndex >= 0 && monthIndex < 12) {
        monthlyTotals[monthIndex].completedReservations += 1
      }
    })

    return monthlyTotals
  }
}
