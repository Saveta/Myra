"""
Fetch Myra's live National Championship results from chess-results.com
and update index.html with the latest data.
Runs server-side via GitHub Actions — no CORS issues.
"""
import re
import sys
import urllib.request

CHESS_RESULTS_URL = (
    "https://s2.chess-results.com/tnr1430075.aspx?lan=1&art=9&fed=IND&snr=110"
)
INDEX_FILE = "index.html"


def fetch_page():
    req = urllib.request.Request(CHESS_RESULTS_URL, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.read().decode("utf-8", errors="replace")


def parse_player_info(html):
    """Extract points, rank, performance rating from the player info table."""
    info = {}
    for m in re.finditer(
        r'<td class="CR">(\w[\w\s]*?)</td>\s*<td class="CR">([^<]+)</td>', html
    ):
        info[m.group(1).strip()] = m.group(2).strip()
    return info


def parse_rounds(html):
    """Extract round-by-round results."""
    # Find the rounds table (second CRs1 table with Rd./Bo./SNo headers)
    tables = list(re.finditer(r'<table class="CRs1"[^>]*>(.*?)</table>', html, re.S))
    if len(tables) < 2:
        return []

    rounds_html = tables[1].group(1)
    rounds = []

    row_pattern = re.compile(
        r'<tr class="CRg[12][^"]*">'
        r'\s*<td class="CRc">(\d+)</td>'        # round
        r'\s*<td class="CRc">(\d+)</td>'         # board
        r'\s*<td class="CRc">\d+</td>'           # SNo
        r'\s*<td class="CR"></td>'
        r'\s*<td class="CR">(?:<a[^>]*>)?([^<]+)(?:</a>)?</td>'  # opponent name
        r'\s*<td class="CRr">(\d+)</td>'         # rating
        r'\s*<td class="CR">\w+</td>'            # FED
        r'\s*<td class="CR">([^<]+)</td>'        # state
        r'\s*<td class="CRc">[\d.]+</td>'       # opponent pts
        r'\s*<td[^>]*>(.*?)</td>'                # result cell
        r'\s*</tr>',
        re.S
    )

    for m in row_pattern.finditer(rounds_html):
        rd = m.group(1)
        board = m.group(2)
        opponent = m.group(3).strip()
        rating = m.group(4)
        state = m.group(5).strip()
        result_cell = m.group(6)

        # Determine color
        if "FarbewT" in result_cell:
            color = "white"
        elif "FarbesT" in result_cell:
            color = "black"
        elif result_cell.strip().startswith("-"):
            color = "black"
        elif result_cell.strip().startswith("+"):
            color = "white"
        else:
            color = "unknown"

        # Determine result
        result_text = re.sub(r"<[^>]+>", "", result_cell).strip()
        # Extract just the score part
        score_match = re.search(r'[^\d]*(1|0|½)\s*$', result_text)
        forfeit_match = re.search(r'[+-]\s*(1|0)\s*K?', result_text)

        if score_match:
            raw = score_match.group(1)
            if raw == "1":
                result, result_class = "✓ 1", "win"
            elif raw == "0":
                result, result_class = "✗ 0", "loss"
            else:
                result, result_class = "½", "draw"
        elif forfeit_match:
            raw = forfeit_match.group(1)
            if raw == "1":
                result, result_class = "✓ 1", "win"
            else:
                result, result_class = "✗ 0", "loss"
        elif result_text == "" or not result_text:
            result, result_class = "Upcoming", "upcoming"
        else:
            result, result_class = "Upcoming", "upcoming"

        rounds.append({
            "round": rd, "board": board, "color": color,
            "opponent": opponent, "state": state, "rating": rating,
            "result": result, "result_class": result_class,
        })

    return rounds


def build_results_html(rounds):
    """Build the tbody HTML for the round-by-round table."""
    rows = []
    for r in rounds:
        color_dot = (
            '<span class="color-dot {c}"></span>'
            '<span class="color-text">{t}</span>'
        ).format(
            c=r["color"],
            t="White" if r["color"] == "white" else "Black" if r["color"] == "black" else "—",
        )

        if r["result_class"] == "upcoming":
            badge = '<span class="result-badge upcoming"><span class="live-dot"></span>{}</span>'.format(r["result"])
        else:
            badge = '<span class="result-badge {}">{}</span>'.format(r["result_class"], r["result"])

        row = (
            "                                <tr>\n"
            "                                    <td>{round}</td>\n"
            "                                    <td>{board}</td>\n"
            "                                    <td>{color}</td>\n"
            '                                    <td class="opponent-cell">{opponent}</td>\n'
            "                                    <td>{state}</td>\n"
            "                                    <td>{rating}</td>\n"
            "                                    <td>{badge}</td>\n"
            "                                </tr>"
        ).format(
            round=r["round"], board=r["board"], color=color_dot,
            opponent=r["opponent"], state=r["state"], rating=r["rating"],
            badge=badge,
        )
        rows.append(row)
    return "\n".join(rows)


def update_index(info, rounds):
    """Update index.html with live data."""
    with open(INDEX_FILE, "r", encoding="utf-8") as f:
        html = f.read()

    points = info.get("Points", "?")
    rank = info.get("Rank", "?")
    perf = info.get("Performance rating", "0")
    completed = [r for r in rounds if r["result_class"] != "upcoming"]
    wins = sum(1 for r in rounds if r["result_class"] == "win")

    # Update points
    html = re.sub(
        r'(<strong[^>]*id="nc-points"[^>]*>)[^<]*(</strong>)',
        r"\g<1>{} / {}\2".format(points, len(completed)),
        html,
    )

    # Update rank
    html = re.sub(
        r'(<strong[^>]*id="nc-rank"[^>]*>)[^<]*(</strong>)',
        r"\g<1>{}\2".format(rank),
        html,
    )

    # Update description
    perf_str = " (Performance: {})".format(perf) if perf and perf != "0" else ""
    desc = (
        "Myra Rathore (FIDE ID 558042920) is representing Punjab &mdash; "
        "{wins} win{s} in {rounds} round{rs}, currently ranked #{rank}{perf}!"
    ).format(
        wins=wins, s="" if wins == 1 else "s",
        rounds=len(completed), rs="" if len(completed) == 1 else "s",
        rank=rank, perf=perf_str,
    )
    html = re.sub(
        r'(<p[^>]*id="nc-desc"[^>]*>)[^<]*(</p>)',
        r"\g<1>{}\2".format(desc),
        html,
    )

    # Update results table body
    new_tbody = build_results_html(rounds)
    html = re.sub(
        r'(<tbody id="nc-results-body">).*?(</tbody>)',
        r"\1\n{}\n                            \2".format(new_tbody),
        html,
        flags=re.S,
    )

    # Update last-updated note
    from datetime import datetime, timezone
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    html = re.sub(
        r'(<p id="nc-last-updated"[^>]*>)[^<]*(</p>)',
        r"\g<1>✅ Last updated: {} (auto-refreshed by GitHub Actions)\2".format(now),
        html,
    )

    # Update the tournament reference in Tournaments Played tab
    html = re.sub(
        r'Score [\d.]+/\d+\+? \(Live\)',
        "Score {}/{}{} (Live)".format(
            points, len(completed), "+" if len(completed) < 9 else ""
        ),
        html,
    )

    with open(INDEX_FILE, "w", encoding="utf-8") as f:
        f.write(html)

    return wins, len(completed), rank, perf


def main():
    print("Fetching Myra's results from chess-results.com...")
    page = fetch_page()

    if "Rathore, Myra" not in page:
        print("ERROR: Could not find Myra's data on the page")
        sys.exit(1)

    info = parse_player_info(page)
    rounds = parse_rounds(page)

    print("Player info:", info)
    print("Rounds found:", len(rounds))
    for r in rounds:
        print("  Rd {}: {} vs {} ({}) = {}".format(
            r["round"], r["color"], r["opponent"], r["rating"], r["result"]
        ))

    if not rounds:
        print("No rounds parsed — skipping update")
        sys.exit(0)

    wins, completed, rank, perf = update_index(info, rounds)
    print("\nUpdated index.html: {}/{} rounds, {} wins, rank #{}, perf {}".format(
        info.get("Points", "?"), completed, wins, rank, perf
    ))


if __name__ == "__main__":
    main()
