import {DateTime} from "./DateTime";
import {DateArg} from "./DateTimeImmutable";
import {DateTimeInterval} from "./DateTimeInterval";

export class DateTimeDiff {
    public static diff(d1: DateArg, d2: DateArg): DateTimeInterval {
        let m1 = new DateTime(d1);
        let m2 = new DateTime(d2);

        if (m1.isEqual(m2)) {
            return new DateTimeInterval();
        }

        const inverse = m1.isAfter(m2);
        if (inverse) {
            [m1, m2] = [m2, m1];
        }

        let years = m2.year - m1.year;
        let months = m2.month - m1.month;
        let days = m2.day - m1.day;
        let hours = m2.hour - m1.hour;
        let minutes = m2.minute - m1.minute;
        let seconds = m2.second - m1.second;
        let ms = m2.ms - m1.ms;

        if (ms < 0) {
            ms += 1000;
            --seconds;
        }

        if (seconds < 0) {
            seconds += 60;
            minutes--;
        }

        if (minutes < 0) {
            minutes += 60;
            hours--;
        }
        if (hours < 0) {
            hours += 24;
            days--;
        }
        if (days < 0) {
            const daysInLastFullMonth = DateTime
                .create(`${m2.year}-${m2.month}`)
                .sub({months: -1})
                .daysInMonth();

            if (daysInLastFullMonth < m1.day) { // 31/01 -> 2/03
                days = daysInLastFullMonth + days + (m1.day - daysInLastFullMonth);
            } else {
                days = daysInLastFullMonth + days;
            }

            months--;
        }

        if (months < 0) {
            months += 12;
            years--;
        }

        return new DateTimeInterval({
            years,
            months,
            days,
            hours,
            minutes,
            seconds,
            ms,
        }, inverse);
    }
}
