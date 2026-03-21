import { store } from "../main.js";
import { embed } from "../util.js";
import { score } from "../score.js";
import { fetchEditors, fetchList } from "../content.js";

import Spinner from "../components/Spinner.js";
import LevelAuthors from "../components/List/LevelAuthors.js";

const roleIconMap = {
    owner: "crown",
    admin: "user-gear",
    helper: "user-shield",
    dev: "code",
    trial: "user-lock",
};

export default {
    components: { Spinner, LevelAuthors },
    template: `
        <main v-if="loading">
            <Spinner></Spinner>
        </main>
        <main v-else class="page-list">
            <div class="list-container">
                <table class="list" v-if="list">
                    <tr v-for="([level, err], i) in list">
                        <td class="rank">
                            <p v-if="i + 1 <= 75" class="type-label-lg">#{{ i + 1 }}</p>
                            <p v-else class="type-label-lg">Legacy</p>
                        </td>
                        <td class="level" :class="{ 'active': selected == i, 'error': !level }">
                            <button @click="selected = i">
                                <span class="type-label-lg">{{ level?.name || \`Error (\${err}.json)\` }}</span>
                            </button>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="level-container">
                <div class="level" v-if="level">
                    <h1>{{ level.name }}</h1>
                    <LevelAuthors :author="level.author" :creators="level.creators" :verifier="level.verifier"></LevelAuthors>
                    <iframe class="video" id="videoframe" :src="video" frameborder="0"></iframe>
                    <ul class="stats">
                        <li>
                            <div class="type-title-sm">Points when completed</div>
                            <p class="type-label-lg">{{ score(selected + 1, 100, level.percentToQualify) }}</p>
                        </li>
                        <li>
                            <div class="type-title-sm">ID</div>
                            <p class="type-label-lg">{{ level.id }}</p>
                        </li>
                        <li>
                            <div class="type-title-sm">Password</div>
                            <p class="type-label-lg">{{ level.password || 'Free to Copy' }}</p>
                        </li>
                        <li>
                            <div class="type-title-sm">Difficulty</div>
                            <p class="type-label-lg">{{ level.difficulty || 'No Difficulty set' }}</p>
                        </li>
                        <li>
                            <div class="type-title-sm">Length</div>
                            <p class="type-label-lg">{{ level.Lenght || 'No Time Set' }}</p>
                        </li>
                    </ul>
                    <h2>Records</h2>
                    <p class="type-label-md" v-if="selected + 1 <= 75"><strong>{{ level.percentToQualify }}%</strong> or better to qualify</p>
                    <p class="type-label-md" v-else-if="selected + 1 <= 150"><strong>100%</strong> or better to qualify</p>
                    <p class="type-label-md" v-else>This level does not accept new records.</p>
                    <table class="records">
                        <tr v-for="record in level.records" class="record">
                            <td class="percent">
                                <p class="type-label-lg">{{ record.percent }}%</p>
                            </td>
                            <td class="user">
                                <a :href="record.link" target="_blank" class="type-label-lg">{{ record.user }}</a>
                            </td>
                            <td class="mobile">
                                <img v-if="record.mobile" :src="\`/assets/phone-landscape\${store.dark ? '-dark' : ''}.svg\`" alt="Mobile">
                            </td>
                            <td class="hz">
                                <p class="type-label-lg">{{ record.hz }}Hz</p>
                            </td>
                        </tr>
                    </table>
                </div>
                <div v-else class="level" style="height: 100%; justify-content: center; align-items: center;">
                    <p class="type-label-lg">(ノಠ益ಠ)ノ彡┻━┻</p>
                </div>
            </div>
            <div class="meta-container">
                <div class="meta">
                    <div class="errors" v-show="errors.length > 0">
                        <p class="error type-label-sm" v-for="error of errors">{{ error }}</p>
                    </div>
                    <div class="og">
                        <p class="type-label-md">Website layout made by <a href="https://tsl.pages.dev/" target="_blank">TheShittyList</a></p>
                    </div>
                    <template v-if="editors">
                        <h3 class="type-title-sm">List Editors</h3>
                        <ol class="editors">
                            <li v-for="editor in editors">
                                <img :src="\`/assets/\${roleIconMap[editor.role]}\${store.dark ? '-dark' : ''}.svg\`" :alt="editor.role">
                                <a v-if="editor.link" class="type-label-lg link" target="_blank" :href="editor.link">{{ editor.name }}</a>
                                <p v-else class="type-label-lg">{{ editor.name }}</p>
                            </li>
                        </ol>
                    </template>

                    <h3 class="type-title-sm">The Vanilla Demon List</h3>
                    <p class="type-label-md" style="margin-bottom: 0;">Official Rulebook – Version 1.0</p>
                    <hr style="margin: 2px 0;">

                    <p class="type-label-md" style="color: #eb3434; font-weight: bold; margin: 0;">
                        These are only the main rules, to view the full rules please look in the rules channel in our Discord server.
                    </p>

                    <h4 class="type-title-sm" style="margin-top: 15px;">1. Overview</h4>
                    <p class="type-label-md">The VDL ranks the hardest demons completed on the official, unmodified Geometry Dash client. No external modifications or tools are permitted.</p>

                    <h4 class="type-title-sm">2. Client Requirements</h4>
                    <ul class="type-label-md">
                        <li>Official Steam release only.</li>
                        <li>Default game physics.</li>
                        <li><strong>Prohibited:</strong> MegaHack, Geode, DLL injection, Clickbots, Macros, Startpos Switcher, Texture Packs, and Overlays.</li>
                    </ul>

                    <h4 class="type-title-sm">3. Allowed Features</h4>
                    <ul class="type-label-md">
                        <li>Built-in FPS Bypass & CBF.</li>
                        <li>Practice Music Sync (In-game).</li>
                        <li>Standard 16:9 or 16:10 resolutions.</li>
                    </ul>

                    <h4 class="type-title-sm">4. FPS & CBF Policy</h4>
                    <p class="type-label-md">Built-in CBF is permitted <strong>ONLY</strong> for players running below 120 FPS. Players at or above 120 FPS must disable it.</p>

                    <h4 class="type-title-sm">5. Proof Requirements</h4>
                    <p class="type-label-md">Full, uncut footage with <strong>audible clicks/taps</strong> is required.</p>
                    <p class="type-label-md"><strong>Post-Completion Evidence:</strong> You must show in-game settings, close the game to show the file directory, and re-launch via Steam in one continuous shot.</p>

                    <h4 class="type-title-sm">6. Philosophy</h4>
                    <p class="type-label-md">The VDL is pro-vanilla competition, measuring skill under official conditions only.</p>
                </div>
            </div>
        </main>
    `,
    data: () => ({
        list: [],
        editors: [],
        loading: true,
        selected: 0,
        errors: [],
        roleIconMap,
        store
    }),
    computed: {
        level() {
            return this.list[this.selected] ? this.list[this.selected][0] : null;
        },
        video() {
            if (!this.level || !this.level.verification) return "";
            if (!this.level.showcase) {
                return embed(this.level.verification);
            }
            return embed(
                this.toggledShowcase
                    ? this.level.showcase
                    : this.level.verification
            );
        },
    },
    async mounted() {
        this.list = await fetchList();
        this.editors = await fetchEditors();

        if (!this.list) {
            this.errors = ["Failed to load list. Retry in a few minutes or notify list staff."];
        } else {
            this.errors.push(
                ...this.list
                    .filter(([_, err]) => err)
                    .map(([_, err]) => `Failed to load level. (${err}.json)`)
            );
            if (!this.editors) {
                this.errors.push("Failed to load list editors.");
            }
        }

        this.loading = false;
    },
    methods: {
        embed,
        score,
    },
};
