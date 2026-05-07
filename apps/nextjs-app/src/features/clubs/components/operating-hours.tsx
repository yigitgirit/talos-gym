import { OperatingHourDto } from "@/lib/api/schema/club.schema";

interface OperatingHoursProps {
  hours: OperatingHourDto[];
}

export function OperatingHours({ hours }: OperatingHoursProps) {
  // Sort hours by day of week order
  const sortedHours = [...hours].sort((a, b) => {
    const dayOrder = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
    return dayOrder.indexOf(a.dayOfWeek) - dayOrder.indexOf(b.dayOfWeek);
  });

  return (
    <div className="bg-muted/50 rounded-lg p-4">
      <div className="space-y-3">
        {sortedHours.map((hour) => (
          <div key={hour.id} className="flex justify-between items-center border-b border-border/50 pb-2 last:border-0 last:pb-0">
            <span className="text-sm font-medium w-24">
              {hour.dayOfWeek.charAt(0) + hour.dayOfWeek.slice(1).toLowerCase()}
            </span>
            {hour.closed ? (
              <span className="text-sm text-destructive font-medium">Closed</span>
            ) : (
              <span className="text-sm text-muted-foreground">
                {hour.openingTime} - {hour.closingTime}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
