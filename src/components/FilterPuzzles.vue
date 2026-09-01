<template>
  <div id="filter">
    <v-expansion-panels v-model="openedFilterPanel" multiple>
      <v-expansion-panel>
        <v-expansion-panel-header>Puzzle Setings</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-card flat color="transparent">
            <v-subheader>Puzzle Rating</v-subheader>
            <v-card-text>
              <v-row>
                <v-col class="px-4">
                  <v-range-slider
                    v-model="ratingRange"
                    :max="3000"
                    :min="500"
                    step="100"
                    hide-details
                    class="align-center"
                  >
                    <template v-slot:prepend>
                      <v-text-field
                        :value="ratingRange[0]"
                        class="mt-0 pt-0"
                        hide-details
                        single-line
                        type="number"
                        style="width: 60px"
                        @change="$set(ratingRange, 0, $event)"
                      ></v-text-field>
                    </template>
                    <template v-slot:append>
                      <v-text-field
                        :value="ratingRange[1]"
                        class="mt-0 pt-0"
                        hide-details
                        single-line
                        type="number"
                        style="width: 60px"
                        @change="$set(ratingRange, 1, $event)"
                      ></v-text-field>
                    </template>
                  </v-range-slider>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <v-card flat color="transparent">
            <v-subheader>Number of Pieces</v-subheader>
            <v-card-text>
              <v-row>
                <v-col class="px-4">
                  <v-range-slider
                    v-model="numberOfPiecesRange"
                    :max="9"
                    :min="3"
                    hide-details
                    class="align-center"
                  >
                    <template v-slot:prepend>
                      <v-text-field
                        :value="numberOfPiecesRange[0]"
                        class="mt-0 pt-0"
                        hide-details
                        single-line
                        type="number"
                        style="width: 60px"
                        @change="$set(numberOfPiecesRange, 0, $event)"
                      ></v-text-field>
                    </template>
                    <template v-slot:append>
                      <v-text-field
                        :value="numberOfPiecesRange[1]"
                        class="mt-0 pt-0"
                        hide-details
                        single-line
                        type="number"
                        style="width: 60px"
                        @change="$set(numberOfPiecesRange, 1, $event)"
                      ></v-text-field>
                    </template>
                  </v-range-slider>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
          
<v-card flat color="transparent">
  <v-subheader>Side to Move</v-subheader>
  <v-card-text>
    <v-btn-toggle v-model="sideFilter" mandatory>
      <v-btn value="any">Any</v-btn>
      <v-btn value="w">White</v-btn>
      <v-btn value="b">Black</v-btn>
    </v-btn-toggle>
  </v-card-text>
</v-card>

<v-card flat color="transparent">
  <v-subheader>Pieces on board (check = must include, tap again = exclude)</v-subheader>
  <v-card-text>
    <v-row>
      <v-col
        v-for="piece in pieceList"
        :key="piece.key"
        cols="6"
        sm="4"
        class="py-1"
      >
        <div class="d-flex align-center">
          <span class="mr-2" style="width: 110px">{{ piece.label }}</span>
          <v-checkbox
            :input-value="isIncluded(piece.key)"
            label="Include"
            hide-details
            dense
            class="mt-0 mr-2"
            @change="togglePieceFilter(piece.key, 'include')"
          ></v-checkbox>
          <v-checkbox
            :input-value="isExcluded(piece.key)"
            label="Exclude"
            hide-details
            dense
            class="mt-0"
            @change="togglePieceFilter(piece.key, 'exclude')"
          ></v-checkbox>
        </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-btn
      block
      :color="noPuzzles ? 'warning' : 'success'"
      class="my-3"
      elevation="2"
      @click="playPuzzle"
      >{{
        noPuzzles
          ? 'No Puzzles found - change puzzle settings and try again'
          : 'Play a puzzle'
      }}</v-btn
    >
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Test',
  data() {
    return {
      pieceList: [
        { key: 'K', label: 'White King' },
        { key: 'Q', label: 'White Queen' },
        { key: 'R', label: 'White Rook' },
        { key: 'B', label: 'White Bishop' },
        { key: 'N', label: 'White Knight' },
        { key: 'P', label: 'White Pawn' },
        { key: 'k', label: 'Black King' },
        { key: 'q', label: 'Black Queen' },
        { key: 'r', label: 'Black Rook' },
        { key: 'b', label: 'Black Bishop' },
        { key: 'n', label: 'Black Knight' },
        { key: 'p', label: 'Black Pawn' },
      ],
    };
  },
  computed: {
    ratingRange: {
      get() {
        return this.$store.state.puzzles.ratingRange;
      },
      set(range) {
        this.$store.commit('puzzles/updateRatingRange', range);
      },
    },
    openedFilterPanel: {
      get() {
        return this.$store.state.puzzles.openedFilterPanel;
      },
      set() {
        this.$store.commit('puzzles/updateOpenedFilterPanel');
      },
    },
    numberOfPiecesRange: {
      get() {
        return this.$store.state.puzzles.numberOfPiecesRange;
      },
      set(range) {
        this.$store.commit('puzzles/updateNumberOfPiecesRange', range);
      },
    },
    sideFilter: {
      get() {
        return this.$store.state.puzzles.sideFilter;
      },
      set(value) {
        this.$store.commit('puzzles/updateSideFilter', value);
      },
    },
    ...mapGetters('puzzles', ['activePuzzleExists', 'noPuzzles']),
  },
  methods: {
    isIncluded(key) {
      return this.$store.state.puzzles.pieceFilters.include.includes(key);
    },
    isExcluded(key) {
      return this.$store.state.puzzles.pieceFilters.exclude.includes(key);
    },
    togglePieceFilter(key, mode) {
      // mode: 'include' or 'exclude'
      const current = { ...this.$store.state.puzzles.pieceFilters };
      const include = [...current.include];
      const exclude = [...current.exclude];

      if (mode === 'include') {
        const idx = include.indexOf(key);
        if (idx >= 0) {
          include.splice(idx, 1);
        } else {
          include.push(key);
          const exIdx = exclude.indexOf(key);
          if (exIdx >= 0) exclude.splice(exIdx, 1); // 排他制御
        }
      } else {
        const idx = exclude.indexOf(key);
        if (idx >= 0) {
          exclude.splice(idx, 1);
        } else {
          exclude.push(key);
          const inIdx = include.indexOf(key);
          if (inIdx >= 0) include.splice(inIdx, 1); // 排他制御
        }
      }

      this.$store.commit('puzzles/updatePieceFilters', { include, exclude });
    },
    playPuzzle() {
      this.$store.commit('puzzles/updatePuzzleSolved', false);
      this.$store.dispatch('puzzles/getRandomPuzzleFromFilteredPuzzles');

      if (this.activePuzzleExists) {
        this.$nextTick(() => {
          this.$vuetify.goTo('#puzzle', {
            duration: 1000,
            offset: 0,
            easing: 'easeInCubic',
          });
        });
      }
    },
  },
};
</script>

<style></style>
