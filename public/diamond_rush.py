"""Diamond Rush - a self-contained, tile-based Pygame cave puzzle.

Install Pygame with ``pip install pygame``, then run ``python diamond_rush.py``.

Screens: Main Menu -> Game Mode (Easy / Medium / Hard) -> Start Game -> Play.
Controls: Arrow keys move, Enter selects, R restarts, Esc goes back.
"""

import sys
import pygame

TILE = 40
COLS, ROWS = 20, 15
WIDTH, HEIGHT = COLS * TILE, ROWS * TILE
FPS = 60

WALL, DIRT, EMPTY, ROCK, DIAMOND, EXIT_DOOR, PLAYER = "#", "d", ".", "O", "*", "E", "P"

# Interior rows (18 x 13). Outer walls are added automatically.
LEVELS = {
    "EASY": [
        "P................E",
        "dd*ddd*ddd*ddd*ddd",
        "dddddddddddddddddd",
        "d*dddd*dddd*dddd*d",
        "dddddddddddddddddd",
        "ddddOddddddddOdddd",
        "dddddddddddddddddd",
        "d*dddddd*ddddd*ddd",
        "dddddddddddddddddd",
        "dddddddddddddddddd",
        "ddd*dddddddd*ddddd",
        "dddddddddddddddddd",
        "dddddddddddddddddd",
    ],
    "MEDIUM": [
        "P...........E",
        "dd*dddddOddddd*ddd",
        "d...ddd##.ddd...dd",
        "d*ddOdd*dddddOd*dd",
        "ddd...dd#...ddd...",
        "Od*dddddOdd*ddd*dd",
        "ddd...d##...ddd...",
        "d*dddddOdd*dd*ddOd",
        "ddd...dd#...ddd...",
        "ddO*dddddOdddd*ddd",
        "ddd...dd#...ddd...",
        "d*dddddd*dddddO*dd",
        "dddddddddddddddddd",
    ],
    "HARD": [
        "P....O.....O.....E",
        "dd*dOd*ddOd*dOd*dd",
        "dOdd.ddOd.ddOdd.dd",
        "d*dOd*ddd*dOd*ddOd",
        "dd.ddOdd.ddOdd.ddd",
        "dOd*dd#Od*d#dd*dOd",
        "d.dddd#ddd.#dddd.d",
        "d*dOd*ddOdd*dOdd*d",
        "ddd.ddOdd.ddOd.ddd",
        "dOdd*dddO*ddd*dOdd",
        "dd.ddOdd.ddOdd.ddd",
        "d*ddOd*ddOd*ddOd*d",
        "dddddddddddddddddd",
    ],
}

MODE_INFO = {
    "EASY": ("Few rocks, open tunnels.", (90, 220, 140)),
    "MEDIUM": ("Rocks and pillars. Plan ahead.", (250, 200, 80)),
    "HARD": ("A cave full of falling stone.", (230, 80, 90)),
}
MODES = ["EASY", "MEDIUM", "HARD"]

C = {
    "bg": (12, 15, 19), "wall": (57, 62, 69), "wall_l": (79, 85, 91), "wall_d": (35, 40, 46),
    "dirt": (113, 74, 48), "dirt_l": (143, 97, 58), "rock": (151, 39, 55), "rock_l": (191, 66, 75),
    "cyan": (69, 231, 248), "cyan_l": (184, 250, 255), "yellow": (255, 214, 80),
    "green": (69, 207, 138), "red": (212, 69, 77), "text": (235, 235, 225), "muted": (140, 150, 148),
}


def build_level(mode):
    rows = [r.ljust(18, DIRT)[:18] for r in LEVELS[mode]]
    return [WALL * COLS] + [WALL + r + WALL for r in rows] + [WALL * COLS]


def new_level(mode):
    grid = [list(row) for row in build_level(mode)]
    settle_gravity(grid)  # settle any loose objects before play begins
    player = next((x, y) for y, row in enumerate(grid) for x, t in enumerate(row) if t == PLAYER)
    total = sum(row.count(DIAMOND) for row in grid)
    return grid, player, total


def settle_gravity(grid):
    """Scan bottom-to-top repeatedly until everything settles. Returns True if the player is crushed."""
    while True:
        moved = False
        for y in range(ROWS - 2, 0, -1):
            for x in range(1, COLS - 1):
                tile = grid[y][x]
                if tile not in (ROCK, DIAMOND):
                    continue
                below = grid[y + 1][x]
                if below == PLAYER:
                    # Only counts as a crush if the object actually falls (empty gap above player was just created)
                    return True
                if below == EMPTY:
                    grid[y + 1][x], grid[y][x] = tile, EMPTY
                    moved = True
        if not moved:
            return False


def draw_tile(screen, x, y, tile, unlocked, ticks):
    px, py = x * TILE, y * TILE
    if tile == WALL:
        pygame.draw.rect(screen, C["wall_d"], (px, py, TILE, TILE))
        pygame.draw.rect(screen, C["wall"], (px + 2, py + 2, 36, 35))
        pygame.draw.line(screen, C["wall_l"], (px + 3, py + 3), (px + 36, py + 3), 2)
        pygame.draw.line(screen, C["wall_l"], (px + 3, py + 3), (px + 3, py + 35), 2)
    elif tile == DIRT:
        pygame.draw.rect(screen, C["dirt"], (px, py, TILE, TILE))
        pygame.draw.rect(screen, C["dirt_l"], (px + 4, py + 5, 15, 3))
        pygame.draw.rect(screen, (91, 58, 40), (px + 23, py + 17, 12, 3))
        pygame.draw.rect(screen, C["dirt_l"], (px + 9, py + 29, 12, 3))
    elif tile == ROCK:
        pygame.draw.circle(screen, (65, 22, 34), (px + 21, py + 23), 17)
        pygame.draw.circle(screen, C["rock"], (px + 19, py + 19), 16)
        pygame.draw.circle(screen, C["rock_l"], (px + 14, py + 13), 6)
    elif tile == DIAMOND:
        draw_diamond(screen, px + 20, py + 19, 16)
    elif tile == PLAYER:
        pygame.draw.circle(screen, (106, 76, 24), (px + 20, py + 24), 16)
        pygame.draw.circle(screen, C["yellow"], (px + 20, py + 19), 15)
        pygame.draw.circle(screen, (255, 240, 156), (px + 15, py + 13), 5)
        pygame.draw.circle(screen, (42, 38, 28), (px + 25, py + 18), 2)
    elif tile == EXIT_DOOR:
        color = C["green"] if unlocked else C["red"]
        pygame.draw.rect(screen, (35, 40, 46), (px + 4, py + 2, 32, 38))
        pygame.draw.rect(screen, color, (px + 8, py + 5, 24, 33))
        pygame.draw.rect(screen, (23, 35, 37), (px + 11, py + 8, 18, 24))
        pygame.draw.circle(screen, color, (px + 25, py + 22), 2)


def draw_diamond(screen, cx, cy, r):
    pygame.draw.polygon(screen, C["cyan"], [(cx, cy - r), (cx + r, cy), (cx, cy + r), (cx - r, cy)])
    pygame.draw.polygon(screen, C["cyan_l"], [(cx, cy - r), (cx, cy), (cx - r, cy)])
    pygame.draw.polygon(screen, (38, 166, 197), [(cx, cy), (cx + r, cy), (cx, cy + r)])


def draw_backdrop(screen):
    screen.fill(C["bg"])
    for x in range(COLS):
        draw_tile(screen, x, 0, WALL, False, 0)
        draw_tile(screen, x, ROWS - 1, WALL, False, 0)
    for y in range(ROWS):
        draw_tile(screen, 0, y, WALL, False, 0)
        draw_tile(screen, COLS - 1, y, WALL, False, 0)


def text(screen, font, msg, color, cx, cy):
    surf = font.render(msg, True, color)
    screen.blit(surf, surf.get_rect(center=(cx, cy)))


def draw_main_menu(screen, fonts, sel, ticks):
    draw_backdrop(screen)
    bob = int(4 * pygame.math.Vector2(1, 0).rotate(ticks / 6).y)
    draw_diamond(screen, WIDTH // 2, 120 + bob, 30)
    text(screen, fonts["big"], "DIAMOND RUSH", C["cyan_l"], WIDTH // 2, 200)
    text(screen, fonts["small"], "Dig deep. Think ahead. Get out alive.", C["muted"], WIDTH // 2, 245)
    for i, item in enumerate(["GAME MODE", "QUIT"]):
        draw_button(screen, fonts["mid"], item, WIDTH // 2, 330 + i * 70, i == sel, C["cyan"])
    text(screen, fonts["small"], "UP/DOWN to choose  -  ENTER to select", C["muted"], WIDTH // 2, 520)


def draw_mode_menu(screen, fonts, sel):
    draw_backdrop(screen)
    text(screen, fonts["big"], "GAME MODE", C["text"], WIDTH // 2, 110)
    for i, m in enumerate(MODES):
        draw_button(screen, fonts["mid"], m, WIDTH // 2, 220 + i * 80, i == sel, MODE_INFO[m][1])
    text(screen, fonts["small"], MODE_INFO[MODES[sel]][0], MODE_INFO[MODES[sel]][1], WIDTH // 2, 470)
    text(screen, fonts["small"], "ENTER to choose  -  ESC to go back", C["muted"], WIDTH // 2, 520)


def draw_start_screen(screen, fonts, mode, total, ticks):
    draw_backdrop(screen)
    color = MODE_INFO[mode][1]
    text(screen, fonts["small"], "SELECTED MODE", C["muted"], WIDTH // 2, 130)
    text(screen, fonts["big"], mode, color, WIDTH // 2, 185)
    text(screen, fonts["small"], MODE_INFO[mode][0], C["text"], WIDTH // 2, 240)
    text(screen, fonts["small"], f"Collect all {total} diamonds to unlock the exit.", C["cyan_l"], WIDTH // 2, 285)
    if (ticks // 500) % 2 == 0:
        draw_button(screen, fonts["mid"], "START GAME", WIDTH // 2, 380, True, color)
    else:
        draw_button(screen, fonts["mid"], "START GAME", WIDTH // 2, 380, False, color)
    text(screen, fonts["small"], "ENTER to start  -  ESC to change mode", C["muted"], WIDTH // 2, 470)


def draw_button(screen, font, label, cx, cy, active, color):
    rect = pygame.Rect(0, 0, 300, 52)
    rect.center = (cx, cy)
    pygame.draw.rect(screen, color if active else (30, 38, 42), rect, border_radius=6)
    pygame.draw.rect(screen, color, rect, 2, border_radius=6)
    text(screen, font, label, (15, 25, 28) if active else C["text"], cx, cy)


def draw_game(screen, grid, collected, total, mode, fonts):
    screen.fill(C["bg"])
    unlocked = collected == total
    ticks = pygame.time.get_ticks()
    for y, row in enumerate(grid):
        for x, tile in enumerate(row):
            draw_tile(screen, x, y, tile, unlocked, ticks)
    pygame.draw.rect(screen, (29, 34, 39), (8, 5, 360, 29))
    screen.blit(fonts["hud"].render(f"{mode}   DIAMONDS {collected:02d}/{total:02d}", True, C["cyan_l"]), (17, 8))
    pygame.draw.rect(screen, (29, 34, 39), (628, 5, 163, 29))
    status = "EXIT OPEN" if unlocked else "EXIT LOCKED"
    screen.blit(fonts["hud"].render(status, True, C["green"] if unlocked else C["red"]), (638, 8))


def main():
    pygame.init()
    screen = pygame.display.set_mode((WIDTH, HEIGHT))
    pygame.display.set_caption("Diamond Rush")
    clock = pygame.time.Clock()
    fonts = {
        "big": pygame.font.SysFont("arial", 56, bold=True),
        "mid": pygame.font.SysFont("arial", 26, bold=True),
        "small": pygame.font.SysFont("arial", 19),
        "hud": pygame.font.SysFont("consolas", 19, bold=True),
    }
    dirs = {pygame.K_UP: (0, -1), pygame.K_DOWN: (0, 1), pygame.K_LEFT: (-1, 0), pygame.K_RIGHT: (1, 0)}

    state = "MENU"
    menu_sel, mode_sel = 0, 0
    mode = "EASY"
    grid, player, total = new_level(mode)
    collected = 0

    while True:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit(); sys.exit()
            if event.type != pygame.KEYDOWN:
                continue
            k = event.key

            if state == "MENU":
                if k in (pygame.K_UP, pygame.K_DOWN):
                    menu_sel = 1 - menu_sel
                elif k == pygame.K_RETURN:
                    if menu_sel == 0:
                        state = "MODE"
                    else:
                        pygame.quit(); sys.exit()
                elif k == pygame.K_ESCAPE:
                    pygame.quit(); sys.exit()

            elif state == "MODE":
                if k == pygame.K_UP:
                    mode_sel = (mode_sel - 1) % 3
                elif k == pygame.K_DOWN:
                    mode_sel = (mode_sel + 1) % 3
                elif k == pygame.K_RETURN:
                    mode = MODES[mode_sel]
                    grid, player, total = new_level(mode)
                    collected = 0
                    state = "START"
                elif k == pygame.K_ESCAPE:
                    state = "MENU"

            elif state == "START":
                if k == pygame.K_RETURN:
                    state = "PLAY"
                elif k == pygame.K_ESCAPE:
                    state = "MODE"

            elif state == "PLAY":
                if k == pygame.K_ESCAPE:
                    state = "MENU"
                    continue
                if k == pygame.K_r:
                    grid, player, total = new_level(mode); collected = 0
                    continue
                if k not in dirs:
                    continue
                dx, dy = dirs[k]
                x, y = player
                nx, ny = x + dx, y + dy
                target = grid[ny][nx]
                if target == WALL or (target == EXIT_DOOR and collected != total):
                    continue
                if target == ROCK:
                    bx, by = nx + dx, ny + dy
                    if grid[by][bx] != EMPTY:
                        continue
                    grid[by][bx] = ROCK
                if target == EXIT_DOOR:
                    print("Level Complete!")
                    grid, player, total = new_level(mode); collected = 0
                    state = "START"
                    continue
                if target == DIAMOND:
                    collected += 1
                grid[y][x] = EMPTY
                grid[ny][nx] = PLAYER
                player = (nx, ny)
                # A crush only happens if an object falls onto the player, not if it was resting
                # on them already. Temporarily mark the cell above the player to detect a fall.
                if crushed_after_move(grid, player):
                    print("Game Over! Crushed!")
                    grid, player, total = new_level(mode); collected = 0

        ticks = pygame.time.get_ticks()
        if state == "MENU":
            draw_main_menu(screen, fonts, menu_sel, ticks)
        elif state == "MODE":
            draw_mode_menu(screen, fonts, mode_sel)
        elif state == "START":
            draw_start_screen(screen, fonts, mode, total, ticks)
        else:
            draw_game(screen, grid, collected, total, mode, fonts)
        pygame.display.flip()
        clock.tick(FPS)


def crushed_after_move(grid, player):
    """After every move, settle gravity. Any rock/diamond falling onto the player crushes them."""
    return settle_gravity(grid)


if __name__ == "__main__":
    main()
