import { _decorator, Button, Component, debug, EventKeyboard, Graphics, input, Input, JsonAsset, KeyCode, Node, Sprite } from 'cc';
import { child, comp } from '../../scripts/Decorator';
import { ResourceMgr } from '../../core_tgx/base/ResourceMgr';
import { ModuleDef } from '../../scripts/ModuleDef';
const { ccclass, property } = _decorator;

enum EidtorOpEnum{
    /** 添加障碍物 */
    ADD_OBSTACLE,
    /** 拖动地图 */
    DRAG_MAP,
    /** 添加起点 */
    ADD_START_POINT,
    /** 添加起点 */
    ADD_END_POINT,
    NONE,
}

@ccclass('EditorComp')
export class EditorComp extends Component {


    @comp(Sprite)
    mapSp:Sprite;
    @comp(Graphics)
    gps:Graphics;

    editorOp:EidtorOpEnum = EidtorOpEnum.NONE;

    xGrid:number;
    yGrid:number;
    seeker:astar.HoneycombSeeker;
    start() {

    }

    protected onEnable(): void {
        this.editorOp = EidtorOpEnum.NONE;
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        this.mapSp.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.mapSp.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.mapSp.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.mapSp.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);

        ResourceMgr.inst.loadBundleNameRes("res/json/map", JsonAsset, (err:any, res:JsonAsset)=>{
            if(res){
                let obj:astar.MapData = res.json as astar.MapData;
                this.seeker = new astar.HoneycombSeeker(obj);
                this.ClickDrawGrid();
                debugger;
            }
        }, ModuleDef.EDITOR)
    }
    
    _hexagonMap:any;
    ClickDrawGrid() {
        var outerRadius = this.seeker.mapData.outerRadius;
        const bgwidth = this.seeker.mapData.mapWidth;
        const bgheight = this.seeker.mapData.mapHeight;
        astar.HexagonUtils.outerRadius = outerRadius;
        let grahics = this.gps;
        this._hexagonMap = [],
        grahics.clear();
        let widthRadius = Math.floor(bgwidth / 2 / outerRadius) + 1
          , heightRadius = Math.floor(bgheight / 3 * 2 / outerRadius) + 1;
        if (console.log(`grid count: ${widthRadius} x ${heightRadius}`),
        widthRadius > 4096 || heightRadius > 4096) {
            if (alert("行数或者列数超过了4096，请调整格子大小！！！"),
            heightRadius > 4096) {
                heightRadius = 4096;
                let t = bgheight / 3 * 2 / 4095;
                outerRadius = t,
                widthRadius = Math.floor(bgwidth / 2 / outerRadius) + 1
            }
            if (widthRadius > 4096) {
                widthRadius = 4096;
                let t = bgwidth / 2 / 4095;
                outerRadius = Math.floor(t / (.5 * Math.sqrt(3))),
                heightRadius = Math.floor(bgheight / 3 * 2 / outerRadius) + 1
            }
        }
        grahics.color = grahics.color.fromHEX("#fefe00");
        grahics.lineWidth = 10;
        for (let t = 0; t < heightRadius; t++) {
            this._hexagonMap[t] = [];
            
            for (let e = 0; e < widthRadius; e++){
                grahics.moveTo((e + t % 2 * .5) * outerRadius * 2, t * outerRadius / 2 * 3);
                const posarr = astar.HexagonUtils.ShareCorners();
                for (let idx = 0; idx < posarr.length; idx+=2) {
                    const pos = posarr[idx];
                    grahics.lineTo(pos[idx], pos[idx+1]);
                }
            }
        }
    }


    update(deltaTime: number) {
        
    }

    onTouchStart(e:TouchEvent){

    }
    onTouchMove(e:TouchEvent){

    }
    onTouchEnd(e:TouchEvent){

    }

    onKeyDown(event: EventKeyboard){
        switch (event.keyCode) {
            case KeyCode.ALT_LEFT:
            case KeyCode.ALT_RIGHT:
                // alt 长按添加障碍物 鼠标点击滑动添加障碍物
                break;

            case KeyCode.SPACE:
                // 空格可以拖动地图 使用鼠标拖动地图

                break;
            
            case KeyCode.ARROW_LEFT:
                // <---添加起点 + 点击地图

                break;
            case KeyCode.ARROW_RIGHT:
                // --->添加终点 + 点击地图

                break;
        
            default:
                break;
        }
    }

    onEditXGrid(){
        
    }

    onEditYGrid(){

    }

    onFindRoad(){

    }

    protected onDisable(): void {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        this.mapSp.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.mapSp.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.mapSp.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.mapSp.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

}


