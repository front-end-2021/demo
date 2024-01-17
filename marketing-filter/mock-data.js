// 1. Table Land: Id (Bigint), Name (VARCHAR)
const Lands = [
    { Id: 1, Name: 'Miền Bắc' },
    { Id: 2, Name: 'Miền Trung' },
    { Id: 3, Name: 'Miền Nam' },
]
// 2. Table Region: Id (Bigint), Name (VARCHAR), LandId (Bigint)
const Regions = [
    { Id: 1, Name: 'Tây Bắc', LandId: 1 },
    { Id: 2, Name: 'Đông Bắc Bộ', LandId: 1 },
    { Id: 3, Name: 'Trung du miền núi phía Bắc', LandId: 1 },
    { Id: 4, Name: 'Hạ lưu sông Hồng', LandId: 1 },
    { Id: 5, Name: 'Thanh Hóa, Nghệ An, Hà Tĩnh', LandId: 2 },
    { Id: 6, Name: 'Đồng Hới, Quảng Bình', LandId: 2 },
    { Id: 7, Name: 'Đồng bằng sông Cứu Long', LandId: 3 },
    { Id: 8, Name: 'Thành Phố Hồ Chí Minh', LandId: 3 },
    { Id: 9, Name: 'Hà Nội', LandId: 1 },
    { Id: 10, Name: 'Miền Tây', LandId: 3 },
    { Id: 11, Name: 'Biên giới Việt-Lào', LandId: 2 },
    { Id: 12, Name: 'Vịnh Nha Trang', LandId: 2 },
]
// 3. Table MapRegionProductGroup: Id (Bigint), RegionId (Bigint), ProductGroupId (Bigint)
// 4. Table ProductGroup: Id (Bigint), Name (VARCHAR)
const ProductGroups = [
    { Id: 1, Name: 'Game Esport', RegionIds: [4, 8, 9] },
    { Id: 2, Name: 'Game In door', RegionIds: [3, 4, 5, 7, 8, 9, 10]},
    { Id: 3, Name: `Education's books`, RegionIds: [1, 2, 3, 5, 10, 11, 12] },
    { Id: 4, Name: `Novel books`, RegionIds: [10, 11, 12] },
    { Id: 5, Name: 'Events', RegionIds: [12, 7] },
    { Id: 6, Name: 'Start up', RegionIds: [9, 8, 4] },
]
// 5. Table Product: Id (Bigint), Name (VARCHAR), ProductGroupId (Bigint)
const Products = [
    { Id: 1, Name: 'Dota 2', PrgId: 1 },
    { Id: 2, Name: 'League of Legend', PrgId: 1 },
    { Id: 3, Name: 'Lien quan Mobile', PrgId: 1 },
    { Id: 4, Name: 'Need for speed 2', PrgId: 1 },
    { Id: 5, Name: 'Futsal', PrgId: 2 },
    { Id: 6, Name: 'Badminton', PrgId: 2 },
    { Id: 7, Name: 'Ping pong', PrgId: 2 },
    {
        Id: 8, Name: `The Good Life: Lessons from the World's Longest Scientific Study of Happiness`,
        PrgId: 3
    },
    {Id: 9, Name: 'Star Wars', PrgId: 4}
]
// 6. Table SubProduct: Id (Bigint), Name (VARCHAR), ProductId (Bigint)
const SubProducts = [
    {Id: 1, Name: `Episode I U+002d The Phantom Menace`, ProdId: 9},
    {Id: 2, Name: `Episode II U+002d Attack of the Clones`, ProdId: 9},
    {Id: 3, Name: `Episode III U+002d Revenge of the Sith`, ProdId: 9},
    {Id: 4, Name: `Episode IV U+002d A New Hope`, ProdId: 9},
    {Id: 5, Name: `Episode V U+002d The Empire Strikes Back`, ProdId: 9},
    {Id: 6, Name: `Episode VI U+002d Return of the Jedi`, ProdId: 9},
]
// 7. Table MapLandMarket: Id (Bigint), LandId (Bigint), MarketId (Bigint)
// 8. Table Market: Id (Bigint), Name (VARCHAR)
const MarketSegments = [
    {Id: 1, Name: 'Aeon', LandIds: [1, 3]},
    {Id: 2, Name: 'Big C', LandIds: [1, 2]},
    {Id: 30, Name: 'Dota ESL Roomate', LandIds: [1, 2, 3]},
    {Id: 4, Name: 'Wwin Mart', LandIds: [2, 3]}
]
// 9. Table Submarket: Id (Bigint), Name (VARCHAR), MarketId (Bigint)
const StakeholderGroups = [
    {Id: 1, Name: 'Aeon Long Biên', MarketId: 1},
    {Id: 2, Name: 'Aeon Hà Đông', MarketId: 1},
    {Id: 3, Name: 'ESL Roomate Hanoi', MarketId: 30},
    {Id: 4, Name: 'Wwin Mart Thanh Xuân', MarketId: 2},
    {Id: 5, Name: 'Wwin Mart Hai Bà Trưng', MarketId: 2},
]
// 10. Table Goal: Id (Bigint), Name (VARCHAR), SubmarketId (Bigint), ProductId (Bigint)
const Goals = [
    {Id: 1, Name: 'Xây dựng 6 điểm bán sách', SubmarketProductId: '1-8'},
    {Id: 2, Name: 'Xây dựng 3 phòng live stream', SubmarketProductId: '2-1'},
]
// 11. Table Action: Id (Bigint), Name (VARCHAR), GoalId (Bigint)
const Actions = [
    {Id: 1, Name: '1 điểm bán trong tháng 3', GoalId: 1},
    {Id: 4, Name: '2 điểm bán trong tháng 6', GoalId: 1},
    {Id: 3, Name: '3 điểm bán trong tháng 9', GoalId: 1},
]