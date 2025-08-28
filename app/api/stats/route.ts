import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const jwt = request.cookies.get("jwt");
    const { searchParams } = new URL(request.url);
    const requestedDays = parseInt(searchParams.get('days') || '5');

    if (!jwt) {
      return NextResponse.json({
        error: "JWT not found. Please configure your JWT token in settings."
      }, { status: 401 });
    }

    const response = await fetch("https://grust.co/api/util/stats", {
      headers: {
        "Cookie": `jwt=${jwt.value}`,
        'Content-Type': 'application/json'
      },
    });

    if (!response.ok) {
      return NextResponse.json({
        error: `API request failed with status ${response.status}`
      }, { status: response.status });
    }

    const apiData = await response.json();
    const statsData = apiData.data || apiData;

    if (apiData.success === false || !statsData.week_data) {
      return NextResponse.json({
        error: "Invalid API response format"
      }, { status: 500 });
    }

    let weekData = statsData.week_data;
    if (requestedDays === 3) {
      weekData = weekData.slice(-3);
    } else if (requestedDays === 5) {
      weekData = weekData.slice(-5);
    }

    const today = new Date();
    const formattedWeekData = weekData.map((day: any, index: number) => {
      const dayDate = new Date(today);
      const daysBack = weekData.length - 1 - index;
      dayDate.setDate(today.getDate() - daysBack);
      const dayOfWeek = dayDate.toLocaleDateString('en-US', { weekday: 'short' });
      const dayOfMonth = dayDate.getDate();

      return {
        name: `${dayOfWeek}(${dayOfMonth})`,
        bans: day.bans || 0,
        new_players: day.new_players || 0,
        unbans: day.unbans || 0,
        date: dayDate.toISOString().split('T')[0]
      };
    });

    const data = {
      today: {
        bans: statsData.today?.bans || 0,
        new_players: statsData.today?.new_players || 0,
        unbans: statsData.today?.unbans || 0,
      },
      yesterday: {
        bans: statsData.yesterday?.bans || 0,
        new_players: statsData.yesterday?.new_players || 0,
        unbans: statsData.yesterday?.unbans || 0,
      },
      week_data: formattedWeekData,
      best_days: statsData.best_days || [],
      total_players: statsData.total_players || 0,
      total_bans: statsData.total_bans || 0,
      new_players: statsData.new_players || 0,
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error('Stats API Error:', error);
    return NextResponse.json({
      error: "Failed to fetch stats from external API"
    }, { status: 500 });
  }
}