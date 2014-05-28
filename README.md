# keycat.cf · Home of the Key Cat

Ask the Key Cat—the Cat Foundation’s prominent four-legged expert on key maps and keyboard shortcuts—about Vim maps, Firefox shortcuts, and more. Or, point him to your own `.key` files full of custom shortcuts and maps. He’s a remarkably resourceful little beast.

(But he’s still in pre-early alpha stage.)

**To Do:**

- Millions—no, _billions_—of maps and shortcuts
- Fuzzy and regular expression search modes
- Search history via up and down keys
- The Qat—aka _Question Cat_—attacking what’s frequently asked
- Smarter, faster, cooler, and *tougher* kitteh

## `.key` File Format

The `.key` file format is very simple—the `keys/default.key` file is an example.

- Each line represents a map or shortcut.
- Keys go before the first space.
- Description goes after the first space.
- Words after a first `#` are _tags_—hidden, but used in search.
- You may put a single `#` before all tags (`… # text copy yank`), or each tag (`… #text #copy #yank @vim $ftw`).

**Example:**

```
gg Go to top # vim movement navigation
yyp Duplicate line # vim text copy yank line
```
